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
import { CreateMediaItemDto } from "@/routes/mediaItem/dto/createMediaItem.dto"
import { GetMediaItemsCountByListIdQueryDto } from "@/routes/mediaItem/dto/getMediaItemsCountByListIdQuery.dto"
import { UpdateMediaItemDto } from "@/routes/mediaItem/dto/updateMediaItem.dto"

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
      = await this.mediaDetailsService.createOrUpdate(
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

  async createBulk(args: {
    userId: string
    items: CreateMediaItemDto[]
  }) {
    if (!args.items.length) {
      return []
    }

    const mediaListIds = Array.from(new Set(args.items.map(item => item.mediaListId)))
    const mediaLists = await this.mediaListRepository.getByIds({
      currentUserId: args.userId,
      ids: mediaListIds,
    })
    const mediaListById = new Map(mediaLists.map(list => [list?.id, list]))

    const uniqueMediaItems = [...(new Map(args.items.map(item => [`${item.mediaType}-${item.mediaId}`, {
      mediaId: item.mediaId,
      mediaType: item.mediaType,
    }])).values())]

    const mediaDetailsList = await Promise.all(uniqueMediaItems.map(item => this.mediaDetailsService.createOrUpdate({
      mediaId: item.mediaId,
      mediaType: item.mediaType,
      skipError: false,
      currentDetails: null,
    })))

    const mediaDetailsByMediaId = new Map(mediaDetailsList.map(details => [details.mediaId, details]))

    const createMediaItemsArgs: Parameters<MediaItemRepositoryInterface["createMany"]>[0] = args.items.map((item) => {
      const mediaList = mediaListById.get(item.mediaListId)
      if (!mediaList) {
        throw new HttpException(
          `Media list with id '${item.mediaListId}' doesn't exist.`,
          HttpStatus.NOT_FOUND,
        )
      }

      if (mediaList.userId !== args.userId) {
        throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
      }

      return {
        mediaId: item.mediaId,
        mediaType: item.mediaType,
        mediaListId: item.mediaListId,
        mediaDetailsId: mediaDetailsByMediaId.get(item.mediaId)?.id,
        currentStatus: item.currentStatus,
      }
    })

    const createdMediaItems = await this.mediaItemRepository.createMany(createMediaItemsArgs)

    const mediaRatings = await this.mediaRatingRepository.getByUserIdAndMediaIds({
      userId: args.userId,
      mediaIds: createdMediaItems.map(item => item.mediaId),
    })

    return createdMediaItems.map((item) => {
      const mediaRating = mediaRatings?.find(
        rating => rating.mediaId === item.mediaId,
      )

      return {
        ...item,
        mediaRating,
      }
    })
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

  async getCountByListId(args: { mediaListId: string, userId: string } & GetMediaItemsCountByListIdQueryDto) {
    const mediaList = await this.mediaListRepository.getById({ id: args.mediaListId })

    if (mediaList && mediaList.userId !== args.userId && mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE) {
      throw new HttpException(`Unauthorized.`, HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.getCountByListId({
      mediaListId: args.mediaListId,
      search: args.search,
    })
  }

  async getByListId(args: Omit<Parameters<MediaItemRepositoryInterface["getByListId"]>[0], "mediaListId"> & {
    userId: string
    mediaListId: string
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

    const response = await this.mediaItemRepository.getByListId({
      mediaListId: mediaList.id,
      search: args.search,
      status: args.status,
      mediaType: args.mediaType,
      sortBy: args.sortBy,
      sortDirection: args.sortDirection,
      limit: args.limit,
      offset: args.offset,
    })

    if (!response.items || response.items.length === 0) {
      return {
        ...response,
        items: [],
      }
    }

    const mediaIds = response.items.map(item => item.mediaId)
    const mediaRatings = await this.mediaRatingRepository.getByUserIdAndMediaIds({
      userId: mediaList.userId,
      mediaIds,
    })

    return {
      ...response,
      items: response.items.map((item) => {
        const mediaRating = mediaRatings.find(
          rating => rating.mediaId === item.mediaId && rating.mediaType === item.mediaType,
        )

        return {
          ...item,
          mediaRating,
        }
      }),
    }
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

  async deleteBulk(args: { ids: string[], userId: string }) {
    if (!args.ids.length) {
      return []
    }

    const mediaItems = await this.mediaItemRepository.getByIds(args.ids)
    const ownerChecks = await Promise.all(mediaItems.map(item => this.isMediaListOwner({
      mediaListId: item.mediaListId,
      userId: args.userId,
      mediaListBase: undefined,
    })))

    if (ownerChecks.some(isOwner => !isOwner)) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.deleteMany(args.ids)
  }

  async update(args: {
    id: string
    userId: string
    data: Partial<Pick<MediaItemType, "mediaDetailsId" | "mediaListId">>
  }) {
    const isMediaItemOwner = await this.isMediaItemOwner({ id: args.id, userId: args.userId })

    if (!isMediaItemOwner) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.update({ id: args.id, data: args.data })
  }

  async updateBulk(args: {
    userId: string
    items: Array<{
      id: string
      data: UpdateMediaItemDto
    }>
  }) {
    if (!args.items.length) {
      return []
    }

    const mediaItems = await this.mediaItemRepository.getByIds(args.items.map(el => el.id))
    const ownerChecks = await Promise.all(mediaItems.map(item => this.isMediaListOwner({
      mediaListId: item.mediaListId,
      userId: args.userId,
      mediaListBase: undefined,
    })))

    if (ownerChecks.some(isOwner => !isOwner)) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaItemRepository.updateMany(args.items)
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
