import { mediaListViews } from "@movie-tracker/database"
import { and, eq } from "@movie-tracker/database/drizzle"
import { Injectable } from "@nestjs/common"
import { MediaListViewRepositoryInterface } from "@/repositories/mediaListView/MediaListViewRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

@Injectable()
export class DrizzleMediaListViewRepository implements MediaListViewRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  async create(args: Parameters<MediaListViewRepositoryInterface["create"]>[0]) {
    await this.drizzle.client
      .insert(mediaListViews)
      .values({
        mediaListId: args.mediaListId,
        userId: args.userId,
      })
  }

  async update(args: Parameters<MediaListViewRepositoryInterface["update"]>[0]) {
    await this.drizzle.client
      .update(mediaListViews)
      .set({ updatedAt: new Date() })
      .where(eq(mediaListViews.id, args.id))
  }

  async getByUseerAndMediaListId(
    args: Parameters<MediaListViewRepositoryInterface["getByUseerAndMediaListId"]>[0],
  ) {
    const [view] = await this.drizzle.client
      .select()
      .from(mediaListViews)
      .where(
        and(
          eq(mediaListViews.mediaListId, args.mediaListId),
          eq(mediaListViews.userId, args.userId),
        ),
      )
      .limit(1)

    return view ?? null
  }
}
