import {
  MediaItemStatusNameEnum,
  MediaItemType,
  MediaListAccessLevelEnum,
  MediaListType,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import {
  MediaListRepositoryInterface,
  MediaListRepositorySymbol,
} from "@/repositories/mediaList/MediaListRepositoryInterface"
import {
  MediaRatingRepositoryInterface,
  MediaRatingRepositorySymbol,
} from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"

@Injectable()
export class MediaItemService {
  constructor(
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
  ) {}

  private async isMediaListOwner(mediaListId: string, userId: string, mediaListBase?: MediaListType) {
    const mediaList
      = mediaListBase || await this.mediaListRepository.getById({ id: mediaListId })

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${mediaListId}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return mediaList.userId === userId
  }

  private async isMediaItemOwner(
    id: string,
    userId: string,
    mediaItemBase?: MediaItemType,
  ) {
    const mediaItem
      = mediaItemBase ?? (await this.mediaItemRepository.getById(id))
    const isMediaListOwner = await this.isMediaListOwner(
      mediaItem.mediaListId,
      userId,
    )

    if (!mediaItem) {
      throw new HttpException(
        `Media item with id '${id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return isMediaListOwner
  }

  async createMediaItem(
    mediaId: number,
    mediaType: MediaTypeEnum,
    mediaListId: string,
    userId: string,
    currentStatus: MediaItemStatusNameEnum,
  ) {
    const mediaList
      = await this.mediaListRepository.getById({ id: mediaListId })

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${mediaListId}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaList.userId !== userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    const mediaDetails
      = await this.mediaDetailsService.createOrUpdateMediaDetails(
        {
          mediaId,
          mediaType,
          skipError: false,
          currentDetails: null,
        },
      )

    const createdMediaItem = await this.mediaItemRepository.create({
      mediaId,
      mediaType,
      mediaListId,
      mediaDetailsId: mediaDetails.id,
      currentStatus,
    })
    const mediaRating = await this.mediaRatingRepository.getByUserIdAndMediaId({
      mediaId,
      userId,
    })

    return {
      ...createdMediaItem,
      mediaRating,
    }
  }

  async getMediaItemsByUserId(userId: string) {
    const mediaItems = await this.mediaItemRepository.getByUserId(userId)
    if (!mediaItems || mediaItems.length === 0) {
      return []
    }

    const mediaIds = mediaItems.map(item => item.mediaId)
    const mediaRatings = await this.mediaRatingRepository.getByUserIdAndMediaIds({
      userId,
      mediaIds,
    })

    return mediaItems.map((item) => {
      const mediaRating = mediaRatings.find(
        rating => rating.mediaId === item.mediaId && rating.mediaType === item.mediaType,
      )

      return {
        ...item,
        mediaRating,
      }
    })
  }

  async getMediaItemsByListId(
    mediaListId: string,
    userId: string,
    byHumanFriendlyId = false,
  ) {
    const mediaList = byHumanFriendlyId
      ? await this.mediaListRepository.getByHumanFriendlyId({
          id: mediaListId,
        })
      : await this.mediaListRepository.getById({ id: mediaListId })

    if (mediaList && mediaList.userId !== userId && mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE) {
      throw new HttpException(`Unauthorized.`, HttpStatus.UNAUTHORIZED)
    }

    const mediaItems = await this.mediaItemRepository.getByListId(mediaList.id)
    if (!mediaItems || mediaItems.length === 0) {
      return []
    }

    const mediaIds = mediaItems.map(item => item.mediaId)
    const mediaRatings = await this.mediaRatingRepository.getByUserIdAndMediaIds({
      userId: mediaList.userId,
      mediaIds,
    })

    return mediaItems.map((item) => {
      const mediaRating = mediaRatings.find(
        rating => rating.mediaId === item.mediaId && rating.mediaType === item.mediaType,
      )

      return {
        ...item,
        mediaRating,
      }
    })
  }

  async deleteMediaItem(id: string, userId: string) {
    const isMediaItemOwner = await this.isMediaItemOwner(id, userId)

    if (!isMediaItemOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.delete(id)
  }

  async updateMediaItem(
    id: string,
    userId: string,
    data: Partial<Pick<MediaItemType, "mediaDetailsId" | "mediaListId">>,
  ) {
    const isMediaItemOwner = await this.isMediaItemOwner(id, userId)

    if (!isMediaItemOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.update({ id, data })
  }

  async createMediaItemClone(
    id: string,
    userId: string,
    mediaListId: string,
    isSaveCreationDate = false,
  ) {
    const isMediaItemOwner = await this.isMediaItemOwner(id, userId)
    const mediaList = await this.mediaListRepository.getById({ id: mediaListId })
    const isMediaListOwner = await this.isMediaListOwner(mediaListId, userId, mediaList)

    if (!isMediaItemOwner || !isMediaListOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    const mediaItem = await this.mediaItemRepository.getById(id)
    const createdMediaItem = await this.mediaItemRepository.createWithExistedData({
      mediaId: mediaItem.mediaId,
      mediaType: mediaItem.mediaType,
      mediaListId,
      mediaDetailsId: mediaItem.mediaDetailsId,
      trackingData: mediaItem.trackingData,
      createdAt: isSaveCreationDate ? mediaItem.createdAt : undefined,
    })

    const mediaRating = await this.mediaRatingRepository.getByUserIdAndMediaId({
      mediaId: mediaItem.mediaId,
      userId: mediaList.userId,
    })

    return {
      ...createdMediaItem,
      mediaRating,
    }
  }
}
