import { randomUUID } from "node:crypto"
import {
  MediaTypeEnum,
  RecommendationInputItemType,
  RecommendationItemType,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { z } from "zod"
import { AiService } from "@/services/ai/ai.service"
import {
  createRecommendationBatchSchema,
  recommendationTasteSummarySchema,
} from "@/services/recommendationGenerator/recommendation.schemas"
import {
  buildRecommendationChunkPrompt,
  buildRecommendationUserPrompt,
  RECOMMENDATION_CHUNK_SYSTEM_PROMPT,
  RECOMMENDATION_SYSTEM_PROMPT,
} from "@/services/recommendationGenerator/recommendationPrompt"
import { AiProviderInvalidResponseError } from "@/shared/errors/ai"
import { convertArrayToChunks } from "@/shared/utils/convertArrayToChunks"
import { mapTasksWithConcurrency } from "@/shared/utils/mapTasksWithConcurrency"
import { normalizeRecommendationTitle } from "@/shared/utils/normalizeRecommendationTitle"

const GENERATION_ATTEMPTS = 2
const TASTE_CHUNK_SIZE = 100
const TASTE_CHUNK_CONCURRENCY = 3

@Injectable()
export class RecommendationGeneratorService {
  constructor(private readonly aiService: AiService) {}

  private getMediaTitleKey(args: { mediaType: MediaTypeEnum, title: string }): string {
    return `${args.mediaType}:${normalizeRecommendationTitle(args.title)}`
  }

  private getMediaIdentityKey(args: { mediaType: MediaTypeEnum, title: string, releaseYear: number }): string {
    return `${this.getMediaTitleKey(args)}:${args.releaseYear}`
  }

  private validateRecommendations(args: {
    value: unknown
    count: number
    candidateCount: number
    items: RecommendationInputItemType[]
    previousRecommendations: RecommendationItemType[]
  }): RecommendationItemType[] {
    const schema = createRecommendationBatchSchema(args.count, args.candidateCount)
    const parsed = schema.parse(args.value)
    const sourceTitleKeys = new Set(args.items.map(item => this.getMediaTitleKey(item)))
    const excludedIdentityKeys = new Set(args.previousRecommendations.map(item => this.getMediaIdentityKey(item)))
    const seenIdentityKeys = new Set<string>()
    const recommendations: RecommendationItemType[] = []

    for (const item of parsed.recommendations) {
      const recommendation: RecommendationItemType = {
        ...item,
        title: item.title.trim().replace(/\s+/g, " "),
        reason: item.reason.trim(),
      }
      const sourceTitleKey = this.getMediaTitleKey(recommendation)
      const identityKey = this.getMediaIdentityKey(recommendation)

      if (
        sourceTitleKeys.has(sourceTitleKey)
        || excludedIdentityKeys.has(identityKey)
        || seenIdentityKeys.has(identityKey)
      ) {
        continue
      }

      seenIdentityKeys.add(identityKey)
      recommendations.push(recommendation)
    }

    if (recommendations.length < args.count) {
      throw new Error(`Expected at least ${args.count} distinct, non-excluded recommendations, received ${recommendations.length}.`)
    }

    return recommendations.slice(0, args.count)
  }

  private async summarizeChunk(args: {
    items: RecommendationInputItemType[]
    chunkIndex: number
    chunksCount: number
    sessionId: string
  }): Promise<string> {
    let lastValidationError: unknown

    for (let attempt = 0; attempt < GENERATION_ATTEMPTS; attempt++) {
      try {
        const response = await this.aiService.generateStructured({
          systemPrompt: RECOMMENDATION_CHUNK_SYSTEM_PROMPT,
          userPrompt: buildRecommendationChunkPrompt(args),
          schemaName: "media_taste_summary",
          schema: z.toJSONSchema(recommendationTasteSummarySchema),
          sessionId: args.sessionId,
          temperature: 0.2,
          maxTokens: 4000,
          disableReasoning: true,
          retryCount: 1,
        })
        return recommendationTasteSummarySchema.parse(response).summary
      }
      catch (error) {
        lastValidationError = error
        if (!(error instanceof AiProviderInvalidResponseError) && !(error instanceof z.ZodError)) {
          throw error
        }
      }
    }

    throw new AiProviderInvalidResponseError({ cause: lastValidationError })
  }

  private async summarizeItems(items: RecommendationInputItemType[], sessionId: string): Promise<string[]> {
    const chunks = convertArrayToChunks(items, TASTE_CHUNK_SIZE)
    const chunksCount = chunks.length

    return mapTasksWithConcurrency({
      items: chunks.map((chunk, chunkIndex) => ({ chunk, chunkIndex })),
      concurrency: TASTE_CHUNK_CONCURRENCY,
      fn: ({ chunk, chunkIndex }) => this.summarizeChunk({
        items: chunk,
        chunkIndex,
        chunksCount,
        sessionId,
      }),
    })
  }

  async generate(args: {
    items: RecommendationInputItemType[]
    count: number
    previousRecommendations?: RecommendationItemType[]
  }): Promise<RecommendationItemType[]> {
    const previousRecommendations = args.previousRecommendations ?? []
    const sessionId = `ses_${randomUUID()}`
    const tasteSummaries = await this.summarizeItems(args.items, sessionId)
    let validationFeedback: string | undefined
    let lastValidationError: unknown

    for (let attempt = 0; attempt < GENERATION_ATTEMPTS; attempt++) {
      const candidateCount = args.count * 2 * (attempt + 1)
      const responseSchema = createRecommendationBatchSchema(args.count, candidateCount)
      let response: unknown
      try {
        response = await this.aiService.generateStructured({
          systemPrompt: RECOMMENDATION_SYSTEM_PROMPT,
          userPrompt: buildRecommendationUserPrompt({
            tasteSummaries,
            count: candidateCount,
            previousRecommendations,
            validationFeedback,
          }),
          schemaName: "media_recommendations",
          schema: z.toJSONSchema(responseSchema),
          sessionId,
          temperature: 0.9,
          maxTokens: 2000 + candidateCount * 180,
          disableReasoning: true,
          retryCount: 1,
        })
      }
      catch (error) {
        if (error instanceof AiProviderInvalidResponseError && attempt < GENERATION_ATTEMPTS - 1) {
          validationFeedback = "Return a valid JSON object matching the supplied schema."
          lastValidationError = error
          continue
        }
        throw error
      }

      try {
        return this.validateRecommendations({
          value: response,
          count: args.count,
          candidateCount,
          items: args.items,
          previousRecommendations,
        })
      }
      catch (error) {
        lastValidationError = error
        validationFeedback = error instanceof Error ? error.message : "The response did not match the required schema."
      }
    }

    throw new AiProviderInvalidResponseError({ cause: lastValidationError })
  }
}
