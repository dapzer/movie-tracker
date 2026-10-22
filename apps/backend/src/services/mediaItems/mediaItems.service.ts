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
import {
  TrackingDataRepositoryInterface,
  TrackingDataRepositorySymbol,
} from "@/repositories/trackingData/TrackingDataRepositoryInterface"
import {
  TvWatchCycleRepositoryInterface,
  TvWatchCycleRepositorySymbol,
} from "@/repositories/tvWatchCycle/TvWatchCycleRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { MediaDetailsService } from "@/services/mediaDetails/mediaDetails.service"
import { CreateMediaItemDto } from "@/services/mediaItems/dto/createMediaItem.dto"
import { CreateMediaItemCloneDto } from "@/services/mediaItems/dto/createMediaItemClone.dto"
import { UpdateMediaItemDto } from "@/services/mediaItems/dto/updateMediaItem.dto"
import { TvWatchCyclesService } from "@/services/tvWatchCycles/tvWatchCycles.service"
import { MediaItemNotFoundError, MediaItemUnauthorizedError } from "@/shared/errors/mediaItem"
import { MediaListNotFoundError } from "@/shared/errors/mediaList"
import { mapTasksWithConcurrency } from "@/shared/utils/mapTasksWithConcurrency"

@Injectable()
export class MediaItemsService {
  constructor(
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
    @Inject(TrackingDataRepositorySymbol)
    private readonly trackingDataRepository: TrackingDataRepositoryInterface,
    @Inject(TvWatchCycleRepositorySymbol)
    private readonly tvWatchCycleRepository: TvWatchCycleRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
    private readonly tvWatchCyclesService: TvWatchCyclesService,
    private readonly drizzleService: DrizzleService,
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

    const createdMediaItem = await this.drizzleService.runInTransaction(async () => {
      const mediaItem = await this.mediaItemRepository.create({
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        mediaListId: args.mediaListId,
        mediaDetailsId: mediaDetails.id,
        currentStatus: args.currentStatus,
      })

      if (args.mediaType === MediaTypeEnum.TV) {
        await this.tvWatchCycleRepository.create({
          mediaItemId: mediaItem.id,
          userId: args.userId,
          mediaId: args.mediaId,
          cycleNumber: 1,
        })
      }

      return mediaItem
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

    const mediaDetailsList = await mapTasksWithConcurrency({
      items: uniqueMediaItems,
      concurrency: 10,
      fn: item => this.mediaDetailsService.createOrUpdate({
        mediaId: item.mediaId,
        mediaType: item.mediaType,
        skipError: false,
        currentDetails: null,
      }),
    })

    const mediaDetailsByMediaId = new Map(mediaDetailsList.map(details => [`${details.mediaType}-${details.mediaId}`, details]))

    const createMediaItemsArgs: Parameters<MediaItemRepositoryInterface["createMany"]>[0] = args.items.map((item) => {
      const mediaList = mediaListById.get(item.mediaListId)
      if (!mediaList) {
        throw new MediaListNotFoundError({ mediaListId: item.mediaListId })
      }

      return {
        mediaId: item.mediaId,
        mediaType: item.mediaType,
        mediaListId: item.mediaListId,
        mediaDetailsId: mediaDetailsByMediaId.get(`${item.mediaType}-${item.mediaId}`)?.id,
        currentStatus: item.currentStatus,
        note: item.note,
        createdAt: item.createdAt,
      }
    })

    const createdMediaItems = await this.drizzleService.runInTransaction(async () => {
      const mediaItems = await this.mediaItemRepository.createMany(createMediaItemsArgs)

      const tvMediaItems = mediaItems.filter(item => item.mediaType === MediaTypeEnum.TV)

      if (tvMediaItems.length) {
        await this.tvWatchCycleRepository.createMany(tvMediaItems.map(item => ({
          mediaItemId: item.id,
          userId: args.userId,
          mediaId: item.mediaId,
          cycleNumber: 1,
        })))
      }

      return mediaItems
    })

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

  async getByMediaId(args: { mediaId: number, mediaType: MediaTypeEnum, userId: string }) {
    const mediaItems = await this.mediaItemRepository.getByMediaId({
      mediaId: args.mediaId,
      mediaType: args.mediaType,
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

    if (args.data.mediaListId) {
      const isTargetListOwner = await this.isMediaListOwner({
        mediaListId: args.data.mediaListId,
        userId: args.userId,
      })

      if (!isTargetListOwner) {
        throw new MediaItemUnauthorizedError({ userId: args.userId, mediaItemId: args.data.mediaListId })
      }
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

    const targetMediaListIds = Array.from(new Set(
      args.items
        .map(item => item.data.mediaListId)
        .filter((id): id is string => Boolean(id)),
    ))

    const targetOwnerChecks = await Promise.all(targetMediaListIds.map(mediaListId => this.isMediaListOwner({
      mediaListId,
      userId: args.userId,
      mediaListBase: undefined,
    })))

    if (targetOwnerChecks.some(isOwner => !isOwner)) {
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

    const sourceTrackingData = await this.trackingDataRepository.getByMediaItemIds(sourceMediaItemIds)
    const sourceTrackingDataByMediaItemId = new Map(sourceTrackingData.map(item => [item.mediaItemId, item]))

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
          ...sourceTrackingDataByMediaItemId.get(item.mediaItemId) ?? null,
          currentStatus: item.currentStatus,
        },
        createdAt: item.isSaveCreationDate ? sourceMediaItem.createdAt : undefined,
      }
    })

    const createdMediaItems = await this.drizzleService.runInTransaction(async () => {
      const mediaItems = await this.mediaItemRepository.createWithExistedDataBulk(createBulkArgs)

      const createdMediaItemByKey = new Map(mediaItems.map(item => [`${item.mediaListId}-${item.mediaType}-${item.mediaId}`, item]))

      await mapTasksWithConcurrency({
        items: args.items,
        concurrency: 10,
        fn: async (item) => {
          const sourceMediaItem = sourceMediaItemById.get(item.mediaItemId)
          const targetMediaItem = createdMediaItemByKey.get(`${item.mediaListId}-${sourceMediaItem.mediaType}-${sourceMediaItem.mediaId}`)

          if (!sourceMediaItem || !targetMediaItem) {
            return
          }

          const clonedCycles = await this.tvWatchCyclesService.cloneByMediaItemId({
            sourceMediaItemId: sourceMediaItem.id,
            targetMediaItemId: targetMediaItem.id,
            targetUserId: args.userId,
          })

          if (!clonedCycles.length && targetMediaItem.mediaType === MediaTypeEnum.TV) {
            await this.tvWatchCycleRepository.create({
              mediaItemId: targetMediaItem.id,
              userId: args.userId,
              mediaId: targetMediaItem.mediaId,
              cycleNumber: 1,
            })
          }
        },
      })

      return mediaItems
    })

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
