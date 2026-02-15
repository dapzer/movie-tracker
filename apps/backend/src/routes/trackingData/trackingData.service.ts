import { MediaItemTrackingDataType } from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from "@/repositories/mediaList/MediaListRepositoryInterface"
import {
  TrackingDataRepositoryInterface,
  TrackingDataRepositorySymbol,
} from "@/repositories/trackingData/TrackingDataRepositoryInterface"

@Injectable()
export class TrackingDataService {
  constructor(
    @Inject(TrackingDataRepositorySymbol)
    private readonly trackingDataRepository: TrackingDataRepositoryInterface,
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
  ) {}

  private async checkIsMediaListOwner(trackingDataId: string, userId: string) {
    const trackingData
      = await this.trackingDataRepository.getById(trackingDataId)
    const mediaList
      = await this.mediaListRepository.getByMediaItemAndUserId({
        mediaItemId: trackingData.mediaItemId,
        userId,
      })

    if (!mediaList) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }
  }

  async update(
    id: string,
    userId: string,
    data: Partial<
      Omit<
        MediaItemTrackingDataType,
        "id" | "createdAt" | "updatedAt" | "mediaItemId"
      >
    >,
  ) {
    await this.checkIsMediaListOwner(id, userId)

    return this.trackingDataRepository.update({ id, data })
  }

  async updateBulk(
    userId: string,
    items: Array<{
      id: string
      data: Partial<
        Omit<
          MediaItemTrackingDataType,
          "id" | "createdAt" | "updatedAt" | "mediaItemId"
        >
      >
    }>,
  ) {
    if (!items.length) {
      return []
    }

    await Promise.all(items.map(item => this.checkIsMediaListOwner(item.id, userId)))
    return this.trackingDataRepository.updateMany(items)
  }
}
