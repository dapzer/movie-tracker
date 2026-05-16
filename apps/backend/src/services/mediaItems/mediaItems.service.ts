import type { GetMediaItemsByListIdQueryType } from "@/services/mediaItems/dto/getMediaItemsByListIdQuery.dto"
import type { GetMediaItemsCountByListIdQueryType } from "@/services/mediaItems/dto/getMediaItemsCountByListIdQuery.dto"
import {
  MediaItemsFiltersQueries,
  MediaItemStatusNameEnum,
  MediaItemType,
  MediaListAccessLevelEnum,
  MediaListType,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
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
import { MediaDetailsService } from "@/services/mediaDetails/mediaDetails.service"
import { CreateMediaItemDto } from "@/services/mediaItems/dto/createMediaItem.dto"
import { CreateMediaItemCloneDto } from "@/services/mediaItems/dto/createMediaItemClone.dto"
import { UpdateMediaItemDto } from "@/services/mediaItems/dto/updateMediaItem.dto"
import { MediaItemNotFoundError, MediaItemUnauthorizedError } from "@/shared/errors/mediaItem"
import { MediaListNotFoundError } from "@/shared/errors/mediaList"

@Injectable()
export class MediaItemsService {
  constructor(
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
  ) {}

  private normalizeMediaItemsFilters(args: {
    mediaTypes?: MediaTypeEnum[]
    rating?: [number, number]
    releaseYear?: [number | undefined, number | undefined]
    genres?: number[]
    releaseStatuses?: string[]
  }): MediaItemsFiltersQueries {
    return {
      mediaTypes: args.mediaTypes,
      rating: args.rating,
      releaseYear: args.releaseYear,
      genres: args.genres,
      releaseStatuses: args.releaseStatuses?.map(status => status.toLowerCase()),
    }
  }

  private async isMediaListOwner(args: { mediaListId: string, userId: string, mediaListBase?: MediaListType }) {
    const mediaList
      = args.mediaListBase || await this.mediaListRepository.getById({ id: args.mediaListId })

    if (!mediaList) {
      throw new MediaListNotFoundError({ mediaListId: args.mediaListId })
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
      throw new MediaItemNotFoundError({ mediaItemId: args.id })
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
      throw new MediaListNotFoundError({ mediaListId: args.mediaListId })
    }

    if (mediaList.userId !== args.userId) {
      throw new MediaItemUnauthorizedError({ userId: args.userId, mediaItemId: args.mediaListId })
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
    const mediaListById = new Map(mediaLists.map((list) => {
      if (list.userId !== args.userId) {
        throw new MediaItemUnauthorizedError({ userId: args.userId })
      }
      return [list?.id, list]
    }))

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
        throw new MediaListNotFoundError({ mediaListId: item.mediaListId })
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

  async getCountByListId(args: { mediaListId: string, userId: string } & GetMediaItemsCountByListIdQueryType) {
    const mediaList = await this.mediaListRepository.getById({ id: args.mediaListId })

    if (!mediaList) {
      throw new MediaListNotFoundError({ mediaListId: args.mediaListId })
    }

    if (mediaList.userId !== args.userId && mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE) {
      throw new MediaItemUnauthorizedError({ userId: args.userId, mediaItemId: args.mediaListId })
    }

    return this.mediaItemRepository.getCountByListId({
      mediaListId: args.mediaListId,
      mediaItemOwnerUserId: mediaList.userId,
      search: args.search,
      ...this.normalizeMediaItemsFilters(args),
    })
  }

  async getByListId(args: GetMediaItemsByListIdQueryType & {
    userId: string
    mediaListId: string
    byHumanFriendlyId?: boolean
  }) {
    const mediaList = args.byHumanFriendlyId
      ? await this.mediaListRepository.getByHumanFriendlyId({
          id: args.mediaListId,
        })
      : await this.mediaListRepository.getById({ id: args.mediaListId })

    if (!mediaList) {
      throw new MediaListNotFoundError({ mediaListId: args.mediaListId })
    }

    if (mediaList.userId !== args.userId && mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE) {
      throw new MediaItemUnauthorizedError({ userId: args.userId, mediaItemId: args.mediaListId })
    }

    const response = await this.mediaItemRepository.getByListId({
      mediaListId: mediaList.id,
      mediaItemOwnerUserId: mediaList.userId,
      search: args.search,
      status: args.status,
      ...this.normalizeMediaItemsFilters(args),
      sortBy: args.sortBy,
      sortDirection: args.sortDirection,
      limit: args.limit ?? 20,
      offset: args.offset ?? 0,
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
      throw new MediaItemUnauthorizedError({ userId: args.userId, mediaItemId: args.id })
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
      throw new MediaItemUnauthorizedError({ userId: args.userId })
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
      throw new MediaItemUnauthorizedError({ userId: args.userId, mediaItemId: args.id })
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
      throw new MediaItemUnauthorizedError({ userId: args.userId })
    }

    return this.mediaItemRepository.updateMany(args.items)
  }

  async createClone(args: {
    id: string
    userId: string
    mediaListId: string
    currentStatus: MediaItemStatusNameEnum
    isSaveCreationDate: boolean
  }) {
    const [createdMediaItem] = await this.createBulkClone({
      userId: args.userId,
      items: [
        {
          mediaItemId: args.id,
          mediaListId: args.mediaListId,
          currentStatus: args.currentStatus,
          isSaveCreationDate: args.isSaveCreationDate,
        },
      ],
    })

    return createdMediaItem
  }

  async createBulkClone(args: {
    userId: string
    items: Array<CreateMediaItemCloneDto & { mediaItemId: string }>
  }) {
    if (!args.items.length) {
      return []
    }

    const sourceMediaItemIds = Array.from(new Set(args.items.map(item => item.mediaItemId)))
    const sourceMediaItems = await this.mediaItemRepository.getByIds(sourceMediaItemIds)

    if (sourceMediaItems.length !== sourceMediaItemIds.length) {
      throw new MediaItemNotFoundError({ mediaItemId: sourceMediaItemIds[0] })
    }

    const sourceMediaItemById = new Map(sourceMediaItems.map(item => [item.id, item]))

    const sourceMediaListIds = sourceMediaItems.map(item => item.mediaListId)
    const targetMediaListIds = args.items.map(item => item.mediaListId)
    const allMediaListIds = Array.from(new Set([...sourceMediaListIds, ...targetMediaListIds]))

    const mediaLists = await this.mediaListRepository.getByIds({
      ids: allMediaListIds,
      currentUserId: args.userId,
    })
    const mediaListById = new Map(mediaLists.map(list => [list.id, list]))

    // Check if all media lists exist and user is owner, source and destination
    for (const listId of allMediaListIds) {
      const mediaList = mediaListById.get(listId)
      if (!mediaList) {
        throw new MediaListNotFoundError({ mediaListId: listId })
      }
      else if (mediaList.userId !== args.userId) {
        throw new MediaItemUnauthorizedError({ userId: args.userId, mediaItemId: listId })
      }
    }

    const createBulkArgs: Parameters<MediaItemRepositoryInterface["createWithExistedDataBulk"]>[0] = args.items.map((item) => {
      const sourceMediaItem = sourceMediaItemById.get(item.mediaItemId)
      if (!sourceMediaItem) {
        throw new MediaItemNotFoundError({ mediaItemId: item.mediaItemId })
      }

      return {
        mediaId: sourceMediaItem.mediaId,
        mediaType: sourceMediaItem.mediaType,
        mediaListId: item.mediaListId,
        mediaDetailsId: sourceMediaItem.mediaDetailsId,
        trackingData: {
          ...sourceMediaItem.trackingData,
          currentStatus: item.currentStatus,
        },
        createdAt: item.isSaveCreationDate ? sourceMediaItem.createdAt : undefined,
      }
    })

    const createdMediaItems = await this.mediaItemRepository.createWithExistedDataBulk(createBulkArgs)

    const mediaRatings = await this.mediaRatingRepository.getByUserIdAndMediaIds({
      userId: args.userId,
      mediaIds: createdMediaItems.map(item => item.mediaId),
    })

    return createdMediaItems.map((item) => {
      const mediaRating = mediaRatings.find(
        rating => rating.mediaId === item.mediaId && rating.mediaType === item.mediaType,
      )

      return {
        ...item,
        mediaRating,
      }
    })
  }
}
