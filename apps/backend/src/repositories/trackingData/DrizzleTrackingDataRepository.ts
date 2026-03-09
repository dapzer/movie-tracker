import { trackingData } from "@movie-tracker/database"
import { eq } from "@movie-tracker/database/drizzle"
import {
  MediaItemSiteToViewType,
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemTvProgressType,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { TrackingDataRepositoryInterface } from "@/repositories/trackingData/TrackingDataRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"

@Injectable()
export class DrizzleTrackingDataRepository implements TrackingDataRepositoryInterface {
  constructor(private readonly drizzle: DrizzleService) {}

  private convertToInterface(data: typeof trackingData.$inferSelect): MediaItemTrackingDataType {
    if (!data) {
      return null
    }

    return {
      id: data.id,
      mediaItemId: data.mediaItemId,
      note: data.note,
      score: data.score,
      currentStatus: MediaItemStatusNameEnum[data.currentStatus.toUpperCase()],
      sitesToView: data.sitesToView as unknown as MediaItemSiteToViewType[],
      tvProgress: data.tvProgress as unknown as MediaItemTvProgressType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  async getById(id: string) {
    const [data] = await this.drizzle.client
      .select()
      .from(trackingData)
      .where(eq(trackingData.id, id))
      .limit(1)

    return this.convertToInterface(data)
  }

  async update(
    args: Parameters<TrackingDataRepositoryInterface["update"]>[0],
  ) {
    const [data] = await this.drizzle.client
      .update(trackingData)
      .set({
        note: args.data.note,
        score: args.data.score,
        currentStatus: args.data.currentStatus,
        sitesToView: args.data.sitesToView as unknown as Array<MediaItemSiteToViewType>,
        tvProgress: args.data.tvProgress as unknown as MediaItemTvProgressType,
      })
      .where(eq(trackingData.id, args.id))
      .returning()

    return this.convertToInterface(data)
  }

  async updateMany(
    args: Parameters<TrackingDataRepositoryInterface["updateMany"]>[0],
  ) {
    if (!args.length) {
      return []
    }

    const updated = await this.drizzle.client.transaction(async (tx) => {
      const results: Array<typeof trackingData.$inferSelect> = []
      for (const item of args) {
        const [row] = await tx
          .update(trackingData)
          .set({
            note: item.data.note,
            score: item.data.score,
            currentStatus: item.data.currentStatus,
            sitesToView: item.data.sitesToView as unknown as Array<MediaItemSiteToViewType>,
            tvProgress: item.data.tvProgress as unknown as MediaItemTvProgressType,
          })
          .where(eq(trackingData.id, item.id))
          .returning()

        results.push(row)
      }

      return results
    })

    return updated.map(this.convertToInterface)
  }
}
