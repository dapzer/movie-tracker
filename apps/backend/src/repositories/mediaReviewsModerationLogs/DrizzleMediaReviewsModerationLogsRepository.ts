import { mediaReviewsModerationLogs } from "@movie-tracker/database"
import { eq } from "@movie-tracker/database/drizzle"
import {
  MediaReviewModerationLog,
  MediaReviewModerationLogAction,
  MediaReviewModerationLogReason,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import {
  MediaReviewsModerationLogsRepositoryInterface,
} from "@/repositories/mediaReviewsModerationLogs/MediaReviewsModerationLogsRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type MediaReviewModerationLogRow = typeof mediaReviewsModerationLogs.$inferSelect

@Injectable()
export class DrizzleMediaReviewsModerationLogsRepository implements MediaReviewsModerationLogsRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(row?: MediaReviewModerationLogRow): MediaReviewModerationLog | undefined {
    if (!row) {
      return undefined
    }

    return {
      id: row.id,
      mediaReviewId: row.mediaReviewId,
      moderatorId: row.moderatorId,
      action: MediaReviewModerationLogAction[row.action as keyof typeof MediaReviewModerationLogAction],
      reason: row.reason
        ? MediaReviewModerationLogReason[row.reason as keyof typeof MediaReviewModerationLogReason]
        : undefined,
      comment: row.comment,
      createdAt: row.createdAt,
    }
  }

  async getById(
    args: Parameters<MediaReviewsModerationLogsRepositoryInterface["getById"]>[0],
  ): Promise<MediaReviewModerationLog | undefined> {
    const [row] = await this.drizzle.client
      .select()
      .from(mediaReviewsModerationLogs)
      .where(eq(mediaReviewsModerationLogs.id, args.id))
      .limit(1)

    return this.convertToInterface(row)
  }

  async getByReviewId(
    args: Parameters<MediaReviewsModerationLogsRepositoryInterface["getByReviewId"]>[0],
  ): Promise<MediaReviewModerationLog[]> {
    const rows = await this.drizzle.client
      .select()
      .from(mediaReviewsModerationLogs)
      .where(eq(mediaReviewsModerationLogs.mediaReviewId, args.mediaReviewId))

    return rows.map(this.convertToInterface)
  }

  async create(
    args: Parameters<MediaReviewsModerationLogsRepositoryInterface["create"]>[0],
  ): Promise<MediaReviewModerationLog> {
    const [row] = await this.drizzle.client
      .insert(mediaReviewsModerationLogs)
      .values({
        mediaReviewId: args.mediaReviewId,
        moderatorId: args.moderatorId,
        action: args.action,
        reason: args.reason ?? null,
        comment: args.comment ?? null,
        createdAt: new Date(),
      })
      .returning()

    return this.convertToInterface(row)
  }
}
