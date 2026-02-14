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

  private async isMediaListOwner(args: { mediaListId: string, userId: string, mediaListBase?: MediaListType }) {
    const mediaList
      = args.mediaListBase || await this.mediaListRepository.getById({ id: args.mediaListId })

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${args.mediaListId}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return mediaList.userId === args.userId
  }

  private async isMediaItemOwner(
    args: {
      id: string
      userId: string
      mediaItemBase?: MediaItemType
    },
  ) {
    const mediaItem
      = args.mediaItemBase ?? (await this.mediaItemRepository.getById(args.id))
    const isMediaListOwner = await this.isMediaListOwner({
      mediaListId: mediaItem.mediaListId,
      userId: args.userId,
    })

    if (!mediaItem) {
      throw new HttpException(
        `Media item with id '${args.id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    return isMediaListOwner
  }

  async create(args: {
    mediaId: number
    mediaType: MediaTypeEnum
    mediaListId: string
    userId: string
    currentStatus: MediaItemStatusNameEnum
  }) {
    const mediaList
      = await this.mediaListRepository.getById({ id: args.mediaListId })

    if (!mediaList) {
      throw new HttpException(
        `Media list with id '${args.mediaListId}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaList.userId !== args.userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    const mediaDetails
      = await this.mediaDetailsService.createOrUpdateMediaDetails(
        {
          mediaId: args.mediaId,
          mediaType: args.mediaType,
          skipError: false,
          currentDetails: null,
        },
      )

    const createdMediaItem = await this.mediaItemRepository.create({
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      mediaListId: args.mediaListId,
      mediaDetailsId: mediaDetails.id,
      currentStatus: args.currentStatus,
    })
    const mediaRating = await this.mediaRatingRepository.getByUserIdAndMediaId({
      mediaId: args.mediaId,
      userId: args.userId,
    })

    return {
      ...createdMediaItem,
      mediaRating,
    }
  }

  async getByUserId(args: { userId: string }) {
    const mediaItems = await this.mediaItemRepository.getByUserId(args.userId)
    if (!mediaItems || mediaItems.length === 0) {
      return []
    }

    const mediaIds = mediaItems.map(item => item.mediaId)
    const mediaRatings = await this.mediaRatingRepository.getByUserIdAndMediaIds({
      userId: args.userId,
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

  async getByListId(args: {
    mediaListId: string
    userId: string
    byHumanFriendlyId?: boolean
  }) {
    const mediaList = args.byHumanFriendlyId
      ? await this.mediaListRepository.getByHumanFriendlyId({
          id: args.mediaListId,
        })
      : await this.mediaListRepository.getById({ id: args.mediaListId })

    if (mediaList && mediaList.userId !== args.userId && mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE) {
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

  async getByMediaId(args: { mediaId: number, userId: string }) {
    const mediaItems = await this.mediaItemRepository.getByMediaId({
      mediaId: args.mediaId,
      userId: args.userId,
    })

    if (!mediaItems || mediaItems.length === 0) {
      return []
    }

    return mediaItems
  }

  async delete(args: { id: string, userId: string }) {
    const isMediaItemOwner = await this.isMediaItemOwner({ id: args.id, userId: args.userId })

    if (!isMediaItemOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.delete(args.id)
  }

  async update(args: {
    id: string
    userId: string
    data: Partial<Pick<MediaItemType, "mediaDetailsId" | "mediaListId">>
  },
  ) {
    const isMediaItemOwner = await this.isMediaItemOwner({ id: args.id, userId: args.userId })

    if (!isMediaItemOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.update({ id: args.id, data: args.data })
  }

  async createClone(args: {
    id: string
    userId: string
    mediaListId: string
    isSaveCreationDate: boolean
  }) {
    const isMediaItemOwner = await this.isMediaItemOwner({ id: args.id, userId: args.userId })
    const mediaList = await this.mediaListRepository.getById({ id: args.mediaListId })
    const isMediaListOwner = await this.isMediaListOwner({ mediaListId: args.mediaListId, userId: args.userId, mediaListBase: mediaList })

    if (!isMediaItemOwner || !isMediaListOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    const mediaItem = await this.mediaItemRepository.getById(args.id)
    const createdMediaItem = await this.mediaItemRepository.createWithExistedData({
      mediaId: mediaItem.mediaId,
      mediaType: mediaItem.mediaType,
      mediaListId: args.mediaListId,
      mediaDetailsId: mediaItem.mediaDetailsId,
      trackingData: mediaItem.trackingData,
      createdAt: args.isSaveCreationDate ? mediaItem.createdAt : undefined,
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
