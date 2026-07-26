import { mediaReviewLikes } from "@movie-tracker/database"
import { and, eq } from "@movie-tracker/database/drizzle"
import { MediaReviewLike, MediaTypeEnum } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { MediaReviewLikeRepositoryInterface } from "@/repositories/mediaReviewLike/MediaReviewLikeRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type MediaReviewLikeRow = typeof mediaReviewLikes.$inferSelect

@Injectable()
export class DrizzleMediaReviewLikeRepository implements MediaReviewLikeRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(row?: MediaReviewLikeRow | null): MediaReviewLike | undefined {
    if (!row) {
      return undefined
    }

    return {
      id: row.id,
      userId: row.userId,
      mediaId: row.mediaId,
      mediaType: MediaTypeEnum[row.mediaType.toUpperCase() as keyof typeof MediaTypeEnum],
      mediaDetailsId: row.mediaDetailsId,
      mediaReviewId: row.mediaReviewId,
      createdAt: row.createdAt,
    }
  }

  async getById(
    args: Parameters<MediaReviewLikeRepositoryInterface["getById"]>[0],
  ): Promise<MediaReviewLike | undefined> {
    const [row] = await this.drizzle.client
      .select()
      .from(mediaReviewLikes)
      .where(eq(mediaReviewLikes.id, args.id))
      .limit(1)

    return this.convertToInterface(row)
  }

  async getByUserIdAndReviewId(
    args: Parameters<MediaReviewLikeRepositoryInterface["getByUserIdAndReviewId"]>[0],
  ): Promise<MediaReviewLike | undefined> {
    const [row] = await this.drizzle.client
      .select()
      .from(mediaReviewLikes)
      .where(
        and(
          eq(mediaReviewLikes.userId, args.userId),
          eq(mediaReviewLikes.mediaReviewId, args.mediaReviewId),
        ),
      )
      .limit(1)

    return row ? this.convertToInterface(row) : undefined
  }

  async getByReviewId(
    args: Parameters<MediaReviewLikeRepositoryInterface["getByReviewId"]>[0],
  ): Promise<MediaReviewLike[]> {
    const rows = await this.drizzle.client
      .select()
      .from(mediaReviewLikes)
      .where(eq(mediaReviewLikes.mediaReviewId, args.mediaReviewId))

    return rows.map(row => this.convertToInterface(row))
  }

  async create(
    args: Parameters<MediaReviewLikeRepositoryInterface["create"]>[0],
  ): Promise<MediaReviewLike> {
    const [row] = await this.drizzle.client
      .insert(mediaReviewLikes)
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

  async delete(id: string): Promise<MediaReviewLike> {
    const [row] = await this.drizzle.client
      .delete(mediaReviewLikes)
      .where(eq(mediaReviewLikes.id, id))
      .returning()

    return this.convertToInterface(row)
  }
}
