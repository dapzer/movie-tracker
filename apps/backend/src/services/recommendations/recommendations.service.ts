import { RecommendationInputItemType, RecommendationItemType, RecommendationResponseType } from "@movie-tracker/types"
import { getMillisecondsFromMins } from "@movie-tracker/utils"
import { Inject, Injectable } from "@nestjs/common"
import {
  RecommendationRepositoryInterface,
  RecommendationRepositorySymbol,
} from "@/repositories/recommendation/RecommendationRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { MediaDetailsService } from "@/services/mediaDetails/mediaDetails.service"
import { RecommendationGeneratorService } from "@/services/recommendationGenerator/recommendationGenerator.service"
import { RedlockService } from "@/services/redlock/redlock.service"
import { TmdbResolverService } from "@/services/tmdbResolver/tmdbResolver.service"
import { RecommendationSessionNotFoundError } from "@/shared/errors/recommendation"
import { mapTasksWithConcurrency } from "@/shared/utils/mapTasksWithConcurrency"

@Injectable()
export class RecommendationsService {
  constructor(
    @Inject(RecommendationRepositorySymbol)
    private readonly recommendationRepository: RecommendationRepositoryInterface,
    private readonly recommendationGeneratorService: RecommendationGeneratorService,
    private readonly tmdbResolverService: TmdbResolverService,
    private readonly mediaDetailsService: MediaDetailsService,
    private readonly drizzleService: DrizzleService,
    private readonly redlockService: RedlockService,
  ) {}

  private async enrichRecommendations(recommendations: RecommendationItemType[]): Promise<RecommendationItemType[]> {
    return mapTasksWithConcurrency({
      items: recommendations,
      concurrency: 5,
      fn: async (recommendation) => {
        const resolved = await this.tmdbResolverService.findByTitleAndReleaseDate({
          title: recommendation.title,
          year: recommendation.releaseYear,
          type: recommendation.mediaType,
        })
        const mediaDetails = await this.mediaDetailsService.createOrUpdate({
          mediaId: resolved.id,
          mediaType: recommendation.mediaType,
          currentDetails: null,
          skipError: false,
        })

        return {
          ...recommendation,
          mediaDetails,
        }
      },
    })
  }

  async create(args: {
    userId: string
    body: { items: RecommendationInputItemType[], count: number }
  }): Promise<RecommendationResponseType> {
    const generatedRecommendations = await this.recommendationGeneratorService.generate({
      items: args.body.items,
      count: args.body.count,
    })
    const recommendations = await this.enrichRecommendations(generatedRecommendations)

    const session = await this.drizzleService.runInTransaction(async () => {
      const createdSession = await this.recommendationRepository.createSession({ userId: args.userId })
      await this.recommendationRepository.addRecommendations({
        sessionId: createdSession.id,
        recommendations,
      })
      return createdSession
    })

    return {
      sessionId: session.id,
      recommendations,
    }
  }

  async refresh(args: {
    sessionId: string
    userId: string
    body: { items: RecommendationInputItemType[], count: number }
  }): Promise<RecommendationResponseType> {
    return this.redlockService.using(
      `recommendation-session:${args.sessionId}`,
      () => this.refreshWithoutLock(args),
      { ttl: getMillisecondsFromMins(5) },
    )
  }

  private async refreshWithoutLock(args: {
    sessionId: string
    userId: string
    body: { items: RecommendationInputItemType[], count: number }
  }): Promise<RecommendationResponseType> {
    const session = await this.recommendationRepository.getSessionByIdAndUserId({
      sessionId: args.sessionId,
      userId: args.userId,
    })
    if (!session) {
      throw new RecommendationSessionNotFoundError({ sessionId: args.sessionId })
    }

    const previousRecommendations = await this.recommendationRepository.getRecommendationsBySessionId(args.sessionId)
    const generatedRecommendations = await this.recommendationGeneratorService.generate({
      items: args.body.items,
      count: args.body.count,
      previousRecommendations,
    })
    const recommendations = await this.enrichRecommendations(generatedRecommendations)

    await this.recommendationRepository.addRecommendations({
      sessionId: args.sessionId,
      recommendations,
    })

    return {
      sessionId: args.sessionId,
      recommendations,
    }
  }
}
