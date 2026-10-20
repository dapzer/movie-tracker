import { tvWatchCycles } from "@movie-tracker/database"
import { and, desc, eq, sql } from "@movie-tracker/database/drizzle"
import { TvWatchCycleType } from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { max } from "drizzle-orm"
import { TvWatchCycleRepositoryInterface } from "@/repositories/tvWatchCycle/TvWatchCycleRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

type TvWatchCycleRow = typeof tvWatchCycles.$inferSelect

@Injectable()
export class DrizzleTvWatchCycleRepository implements TvWatchCycleRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(data: TvWatchCycleRow): TvWatchCycleType {
    return {
      id: data.id,
      mediaItemId: data.mediaItemId,
      userId: data.userId,
      mediaId: data.mediaId,
      cycleNumber: data.cycleNumber,
      startedAt: data.startedAt,
      finishedAt: data.finishedAt,
    }
  }

  async getById(id: string) {
    const [row] = await this.drizzle.client
      .select()
      .from(tvWatchCycles)
      .where(eq(tvWatchCycles.id, id))
      .limit(1)

    return row ? this.convertToInterface(row) : undefined
  }

  async getActiveByMediaItemId(mediaItemId: string) {
    const [row] = await this.drizzle.client
      .select()
      .from(tvWatchCycles)
      .where(
        and(
          eq(tvWatchCycles.mediaItemId, mediaItemId),
          sql`${tvWatchCycles.finishedAt} is null`,
        ),
      )
      .limit(1)

    return row ? this.convertToInterface(row) : undefined
  }

  async getAllByMediaItemId(mediaItemId: string) {
    const rows = await this.drizzle.client
      .select()
      .from(tvWatchCycles)
      .where(eq(tvWatchCycles.mediaItemId, mediaItemId))
      .orderBy(desc(tvWatchCycles.cycleNumber))

    return rows.map(this.convertToInterface)
  }

  async create(args: Parameters<TvWatchCycleRepositoryInterface["create"]>[0]) {
    const [row] = await this.drizzle.client
      .insert(tvWatchCycles)
      .values({
        mediaItemId: args.mediaItemId,
        userId: args.userId,
        mediaId: args.mediaId,
        cycleNumber: args.cycleNumber,
        startedAt: args.startedAt,
      })
      .returning()

    return this.convertToInterface(row)
  }

  async createMany(args: Parameters<TvWatchCycleRepositoryInterface["createMany"]>[0]) {
    if (!args.length) {
      return []
    }

    const rows = await this.drizzle.client
      .insert(tvWatchCycles)
      .values(args.map(item => ({
        mediaItemId: item.mediaItemId,
        userId: item.userId,
        mediaId: item.mediaId,
        cycleNumber: item.cycleNumber,
        startedAt: item.startedAt,
        finishedAt: item.finishedAt,
      })))
      .returning()

    return rows.map(this.convertToInterface)
  }

  async startNewCycle(args: Parameters<TvWatchCycleRepositoryInterface["startNewCycle"]>[0]) {
    return this.drizzle.client.transaction(async (tx) => {
      const [maxRow] = await tx
        .select({ max: max(tvWatchCycles.cycleNumber) })
        .from(tvWatchCycles)
        .where(eq(tvWatchCycles.mediaItemId, args.mediaItemId))

      await tx
        .update(tvWatchCycles)
        .set({ finishedAt: new Date() })
        .where(
          and(
            eq(tvWatchCycles.mediaItemId, args.mediaItemId),
            sql`${tvWatchCycles.finishedAt} is null`,
          ),
        )

      const [created] = await tx
        .insert(tvWatchCycles)
        .values({
          mediaItemId: args.mediaItemId,
          userId: args.userId,
          mediaId: args.mediaId,
          cycleNumber: (maxRow?.max ?? 0) + 1,
        })
        .returning()

      return this.convertToInterface(created)
    })
  }
}
