import { tvEpisodeWatches } from "@movie-tracker/database"
import { eq, inArray } from "@movie-tracker/database/drizzle"
import { TvEpisodeWatchType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { TvEpisodeWatchRepositoryInterface } from "@/repositories/tvEpisodeWatch/TvEpisodeWatchRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type TvEpisodeWatchRow = typeof tvEpisodeWatches.$inferSelect

@Injectable()
export class DrizzleTvEpisodeWatchRepository implements TvEpisodeWatchRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(data: TvEpisodeWatchRow): TvEpisodeWatchType {
    return {
      id: data.id,
      watchCycleId: data.watchCycleId,
      userId: data.userId,
      mediaId: data.mediaId,
      mediaDetailsId: data.mediaDetailsId,
      seasonNumber: data.seasonNumber,
      episodeNumber: data.episodeNumber,
      watchedAt: data.watchedAt,
    }
  }

  async getById(id: string) {
    const [row] = await this.drizzle.client
      .select()
      .from(tvEpisodeWatches)
      .where(eq(tvEpisodeWatches.id, id))
      .limit(1)

    return row ? this.convertToInterface(row) : undefined
  }

  async getByCycleId(watchCycleId: string) {
    const rows = await this.drizzle.client
      .select()
      .from(tvEpisodeWatches)
      .where(eq(tvEpisodeWatches.watchCycleId, watchCycleId))

    return rows.map(this.convertToInterface)
  }

  async getByCycleIds(watchCycleIds: string[]) {
    if (!watchCycleIds.length) {
      return []
    }

    const rows = await this.drizzle.client
      .select()
      .from(tvEpisodeWatches)
      .where(inArray(tvEpisodeWatches.watchCycleId, watchCycleIds))

    return rows.map(this.convertToInterface)
  }

  async create(args: Parameters<TvEpisodeWatchRepositoryInterface["create"]>[0]) {
    const [created] = await this.drizzle.client
      .insert(tvEpisodeWatches)
      .values({
        watchCycleId: args.watchCycleId,
        userId: args.userId,
        mediaId: args.mediaId,
        mediaDetailsId: args.mediaDetailsId,
        seasonNumber: args.seasonNumber,
        episodeNumber: args.episodeNumber,
      })
      .returning()

    return this.convertToInterface(created)
  }

  async createMany(args: Parameters<TvEpisodeWatchRepositoryInterface["createMany"]>[0]) {
    if (!args.length) {
      return []
    }

    const rows = await this.drizzle.client
      .insert(tvEpisodeWatches)
      .values(args.map(item => ({
        watchCycleId: item.watchCycleId,
        userId: item.userId,
        mediaId: item.mediaId,
        mediaDetailsId: item.mediaDetailsId,
        seasonNumber: item.seasonNumber,
        episodeNumber: item.episodeNumber,
        watchedAt: item.watchedAt,
      })))
      .returning()

    return rows.map(this.convertToInterface)
  }

  async delete(id: string) {
    const [row] = await this.drizzle.client
      .delete(tvEpisodeWatches)
      .where(eq(tvEpisodeWatches.id, id))
      .returning()

    return row ? this.convertToInterface(row) : undefined
  }
}
