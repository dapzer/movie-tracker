import { mediaDetails } from "@movie-tracker/database"
import { and, eq, inArray } from "@movie-tracker/database/drizzle"
import { MediaDetailsInfoType, MediaDetailsType, MediaTypeEnum } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { count } from "drizzle-orm"
import { MediaDetailsRepositoryInterface } from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

@Injectable()
export class DrizzleMediaDetailsRepository
implements MediaDetailsRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(data: typeof mediaDetails.$inferSelect | null): MediaDetailsType | null {
    if (!data) {
      return null
    }

    return {
      id: data.id,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase() as keyof typeof MediaTypeEnum],
      score: data.score ? Number(data.score) : 0,
      releaseDate: data.releaseDate || undefined,
      genres: data.genres,
      status: data.status,
      en: data.en as MediaDetailsInfoType,
      ru: data.ru as MediaDetailsInfoType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  async getByMediaIds(args: Parameters<MediaDetailsRepositoryInterface["getByMediaIds"]>[0]) {
    const details = await this.drizzle.client
      .select()
      .from(mediaDetails)
      .where(inArray(mediaDetails.mediaId, args.mediaIds))

    return details.map(detail => this.convertToInterface(detail))
  }

  async create(args: Parameters<MediaDetailsRepositoryInterface["create"]>[0]) {
    const [detail] = await this.drizzle.client
      .insert(mediaDetails)
      .values({
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        score: args.score.toString(),
        genres: args.genres,
        status: args.status,
        releaseDate: args.releaseDate,
        ru: args.ru,
        en: args.en,
      })
      .returning()

    return this.convertToInterface(detail)
  }

  async update(args: Parameters<MediaDetailsRepositoryInterface["update"]>[0]) {
    const [detail] = await this.drizzle.client
      .update(mediaDetails)
      .set({
        score: args.score.toString(),
        genres: args.genres,
        status: args.status,
        releaseDate: args.releaseDate,
        ru: args.ru,
        en: args.en,
      })
      .where(eq(mediaDetails.mediaId, args.mediaId))
      .returning()

    return this.convertToInterface(detail)
  }

  async getByMediaData(args: Parameters<MediaDetailsRepositoryInterface["getByMediaData"]>[0]) {
    const [detail] = await this.drizzle.client
      .select()
      .from(mediaDetails)
      .where(
        and(
          eq(mediaDetails.mediaId, args.mediaId),
          eq(mediaDetails.mediaType, args.mediaType),
        ),
      )
      .limit(1)

    return this.convertToInterface(detail)
  }

  async getAll() {
    const details = await this.drizzle.client
      .select()
      .from(mediaDetails)

    return details.map(detail => this.convertToInterface(detail))
  }

  async getCount() {
    const [result] = await this.drizzle.client
      .select({ count: count() })
      .from(mediaDetails)

    return Number(result?.count ?? 0)
  }
}
