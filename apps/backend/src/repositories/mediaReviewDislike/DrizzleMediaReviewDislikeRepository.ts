import { mediaReviewDislikes } from "@movie-tracker/database"
import { and, eq } from "@movie-tracker/database/drizzle"
import { MediaReviewDislike, MediaTypeEnum } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import {
  MediaReviewDislikeRepositoryInterface,
} from "@/repositories/mediaReviewDislike/MediaReviewDislikeRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type MediaReviewDislikeRow = typeof mediaReviewDislikes.$inferSelect

@Injectable()
export class DrizzleMediaReviewDislikeRepository implements MediaReviewDislikeRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(row?: MediaReviewDislikeRow | null): MediaReviewDislike | undefined {
    if (!row) {
      return undefined
    }

    return {
      id: row.id,
      userId: row.userId,
      mediaId: row.mediaId,
      mediaType: MediaTypeEnum[row.mediaType.toUpperCase() as keyof typeof MediaTypeEnum],
      mediaDetailsId: row.mediaDetailsId ?? "",
      mediaReviewId: row.mediaReviewId,
      createdAt: row.createdAt,
    }
  }

  async getById(
    args: Parameters<MediaReviewDislikeRepositoryInterface["getById"]>[0],
  ): Promise<MediaReviewDislike | undefined> {
    const [row] = await this.drizzle.client
      .select()
      .from(mediaReviewDislikes)
      .where(eq(mediaReviewDislikes.id, args.id))
      .limit(1)

    return this.convertToInterface(row)
  }

  async getByUserIdAndReviewId(
    args: Parameters<MediaReviewDislikeRepositoryInterface["getByUserIdAndReviewId"]>[0],
  ): Promise<MediaReviewDislike | undefined> {
    const [row] = await this.drizzle.client
      .select()
      .from(mediaReviewDislikes)
      .where(
        and(
          eq(mediaReviewDislikes.userId, args.userId),
          eq(mediaReviewDislikes.mediaReviewId, args.mediaReviewId),
        ),
      )
      .limit(1)

    return this.convertToInterface(row)
  }

  async getByReviewId(
    args: Parameters<MediaReviewDislikeRepositoryInterface["getByReviewId"]>[0],
  ): Promise<MediaReviewDislike[]> {
    const rows = await this.drizzle.client
      .select()
      .from(mediaReviewDislikes)
      .where(eq(mediaReviewDislikes.mediaReviewId, args.mediaReviewId))

    return rows.map(this.convertToInterface)
  }

  async create(
    args: Parameters<MediaReviewDislikeRepositoryInterface["create"]>[0],
  ): Promise<MediaReviewDislike> {
    const [row] = await this.drizzle.client
      .insert(mediaReviewDislikes)
      .values({
        userId: args.userId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        mediaDetailsId: args.mediaDetailsId,
        mediaReviewId: args.mediaReviewId,
      })
      .returning()

    return this.convertToInterface(row)
  }

  async delete(id: string): Promise<MediaReviewDislike> {
    const [row] = await this.drizzle.client
      .delete(mediaReviewDislikes)
      .where(eq(mediaReviewDislikes.id, id))
      .returning()

    return this.convertToInterface(row)
  }
}
