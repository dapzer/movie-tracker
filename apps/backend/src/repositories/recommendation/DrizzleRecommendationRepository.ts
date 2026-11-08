import { mediaDetails, mediaRecommendations, recommendationSessions } from "@movie-tracker/database"
import { and, eq, inArray } from "@movie-tracker/database/drizzle"
import {
  MediaDetailsType,
  MediaTypeEnum,
  RecommendationSessionType,
  StoredRecommendationType,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { asc } from "drizzle-orm"
import { RecommendationRepositoryInterface } from "@/repositories/recommendation/RecommendationRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { InternalError } from "@/shared/errors/core"

type RecommendationSessionRow = typeof recommendationSessions.$inferSelect
type MediaRecommendationRow = typeof mediaRecommendations.$inferSelect
type MediaDetailsRow = typeof mediaDetails.$inferSelect

@Injectable()
export class DrizzleRecommendationRepository implements RecommendationRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertSessionToInterface(row: RecommendationSessionRow): RecommendationSessionType {
    return {
      id: row.id,
      userId: row.userId,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }

  private convertMediaDetailsToInterface(row: MediaDetailsRow): MediaDetailsType {
    return {
      id: row.id,
      mediaId: row.mediaId,
      mediaType: MediaTypeEnum[row.mediaType.toUpperCase() as keyof typeof MediaTypeEnum],
      score: row.score ? Number(row.score) : 0,
      releaseDate: row.releaseDate || undefined,
      status: row.status,
      genres: row.genres,
      en: row.en,
      ru: row.ru,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
    }
  }

  private convertRecommendationToInterface(args: {
    recommendation: MediaRecommendationRow
    mediaDetails: MediaDetailsRow
  }): StoredRecommendationType {
    const details = this.convertMediaDetailsToInterface(args.mediaDetails)
    return {
      id: args.recommendation.id,
      sessionId: args.recommendation.sessionId,
      mediaId: args.recommendation.mediaId,
      mediaDetailsId: args.recommendation.mediaDetailsId,
      mediaType: MediaTypeEnum[args.recommendation.mediaType.toUpperCase() as keyof typeof MediaTypeEnum],
      title: details.en.title || details.ru.title,
      releaseYear: Number(details.releaseDate?.slice(0, 4)),
      reason: args.recommendation.reason,
      mediaDetails: details,
      createdAt: args.recommendation.createdAt,
    }
  }

  private async getRecommendationsByIds(ids: string[]): Promise<StoredRecommendationType[]> {
    if (!ids.length) {
      return []
    }

    const rows = await this.drizzle.client
      .select({ recommendation: mediaRecommendations, mediaDetails })
      .from(mediaRecommendations)
      .innerJoin(mediaDetails, eq(mediaDetails.id, mediaRecommendations.mediaDetailsId))
      .where(inArray(mediaRecommendations.id, ids))
      .orderBy(asc(mediaRecommendations.createdAt), asc(mediaRecommendations.id))

    return rows.map(row => this.convertRecommendationToInterface(row))
  }

  async createSession(args: Parameters<RecommendationRepositoryInterface["createSession"]>[0]) {
    const [session] = await this.drizzle.client
      .insert(recommendationSessions)
      .values({ userId: args.userId })
      .returning()

    return this.convertSessionToInterface(session)
  }

  async getSessionByIdAndUserId(args: Parameters<RecommendationRepositoryInterface["getSessionByIdAndUserId"]>[0]) {
    const [session] = await this.drizzle.client
      .select()
      .from(recommendationSessions)
      .where(and(
        eq(recommendationSessions.id, args.sessionId),
        eq(recommendationSessions.userId, args.userId),
      ))
      .limit(1)

    return session ? this.convertSessionToInterface(session) : undefined
  }

  async getRecommendationsBySessionId(sessionId: string) {
    const rows = await this.drizzle.client
      .select({ id: mediaRecommendations.id })
      .from(mediaRecommendations)
      .where(eq(mediaRecommendations.sessionId, sessionId))
      .orderBy(asc(mediaRecommendations.createdAt), asc(mediaRecommendations.id))

    return this.getRecommendationsByIds(rows.map(row => row.id))
  }

  async addRecommendations(args: Parameters<RecommendationRepositoryInterface["addRecommendations"]>[0]) {
    if (!args.recommendations.length) {
      return []
    }

    return this.drizzle.runInTransaction(async () => {
      const rows = await this.drizzle.client
        .insert(mediaRecommendations)
        .values(args.recommendations.map((recommendation) => {
          if (!recommendation.mediaDetails) {
            throw new InternalError("Cannot store a recommendation without media details.")
          }

          return {
            sessionId: args.sessionId,
            mediaId: recommendation.mediaDetails.mediaId,
            mediaDetailsId: recommendation.mediaDetails.id,
            mediaType: recommendation.mediaType,
            reason: recommendation.reason,
          }
        }))
        .returning({ id: mediaRecommendations.id })

      await this.drizzle.client
        .update(recommendationSessions)
        .set({ updatedAt: new Date() })
        .where(eq(recommendationSessions.id, args.sessionId))

      return this.getRecommendationsByIds(rows.map(row => row.id))
    })
  }
}
