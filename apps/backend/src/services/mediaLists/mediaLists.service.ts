import {
  MEDIA_LIST_COUNT_LIMIT,
  MediaListAccessLevelEnum,
  MediaListType,
  MediaTypeEnum,
  NotificationTypeEnum,
  RecommendationInputItemType,
} from "@movie-tracker/types"
import { Inject, Injectable, Logger } from "@nestjs/common"
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
  MediaReviewRepositoryInterface,
  MediaReviewRepositorySymbol,
} from "@/repositories/mediaReview/MediaReviewRepositoryInterface"
import {
  TrackingDataRepositoryInterface,
  TrackingDataRepositorySymbol,
} from "@/repositories/trackingData/TrackingDataRepositoryInterface"
import {
  TvWatchCycleRepositoryInterface,
  TvWatchCycleRepositorySymbol,
} from "@/repositories/tvWatchCycle/TvWatchCycleRepositoryInterface"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { CreateMediaListDto } from "@/services/mediaLists/dto/createMediaList.dto"
import { CreateMediaListCloneDto } from "@/services/mediaLists/dto/createMediaListClone.dto"
import { UpdateMediaListDto } from "@/services/mediaLists/dto/updateMediaList.dto"
import { NotificationsService } from "@/services/notifications/notifications.service"
import { RecommendationsService } from "@/services/recommendations/recommendations.service"
import { TvWatchCyclesService } from "@/services/tvWatchCycles/tvWatchCycles.service"
import { BadArgumentsError } from "@/shared/errors/core"
import {
  MediaListLimitReachedError,
  MediaListNotFoundError,
  MediaListSelfDislikeError,
  MediaListSelfLikeError,
  MediaListUnauthorizedError,
  SystemMediaListDeletionError,
} from "@/shared/errors/mediaList"
import { mapTasksWithConcurrency } from "@/shared/utils/mapTasksWithConcurrency"
import { MediaListLikeDto } from "./dto/mediaListLike.dto"

@Injectable()
export class MediaListsService {
  private readonly logger = new Logger("MediaListsService")

  constructor(
    @Inject(MediaListRepositorySymbol)
    private readonly mediaListRepository: MediaListRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
    @Inject(MediaReviewRepositorySymbol)
    private readonly mediaReviewRepository: MediaReviewRepositoryInterface,
    @Inject(TrackingDataRepositorySymbol)
    private readonly trackingDataRepository: TrackingDataRepositoryInterface,
    @Inject(TvWatchCycleRepositorySymbol)
    private readonly tvWatchCycleRepository: TvWatchCycleRepositoryInterface,
    private readonly tvWatchCyclesService: TvWatchCyclesService,
    private readonly notificationsService: NotificationsService,
    private readonly drizzleService: DrizzleService,
    private readonly recommendationsService: RecommendationsService,
  ) {
  }

  private async isListOwner(
    id: string,
    currentUserId: string,
    mediaListBase?: MediaListType,
  ) {
    const mediaList
      = mediaListBase ?? (await this.mediaListRepository.getById({ id }))

    if (!mediaList) {
      throw new MediaListNotFoundError({ mediaListId: id })
    }

    return mediaList.userId === currentUserId
  }

  async validateIsListOwner(id: string, userId: string) {
    const isListOwner = await this.isListOwner(id, userId)

    if (!isListOwner) {
      throw new MediaListUnauthorizedError({ userId, mediaListId: id })
    }
  }

  async validateIsMediaListsLimitReached(userId: string, additionalCount = 1) {
    const mediaListsCount = await this.mediaListRepository.getCountByUserId(userId)

    if (mediaListsCount + additionalCount > MEDIA_LIST_COUNT_LIMIT) {
      throw new MediaListLimitReachedError({ userId, limit: MEDIA_LIST_COUNT_LIMIT })
    }

    return false
  }

  async getById(
    id: string,
    currentUserId: string,
    byHumanFriendlyId = false,
  ) {
    const mediaList = byHumanFriendlyId
      ? await this.mediaListRepository.getByHumanFriendlyId({
          id,
          currentUserId,
        })
      : await this.mediaListRepository.getById({ id, currentUserId })
    const isListOwner = await this.isListOwner(id, currentUserId, mediaList)

    if (!isListOwner && (mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE)) {
      throw new MediaListUnauthorizedError({ userId: currentUserId, mediaListId: id })
    }

    return mediaList
  }

  async getByUserId(userId: string, currentUserId: string, isPublicOnly?: boolean) {
    return this.mediaListRepository.getByUserId({
      userId,
      currentUserId,
      isPublicOnly,
    })
  }

  async generateRecommendations(args: {
    mediaListId: string
    userId: string
    count: number
    sessionId?: string
  }) {
    const mediaList = await this.mediaListRepository.getById({ id: args.mediaListId })
    if (!mediaList) {
      throw new MediaListNotFoundError({ mediaListId: args.mediaListId })
    }
    if (mediaList.userId !== args.userId) {
      throw new MediaListUnauthorizedError({ userId: args.userId, mediaListId: args.mediaListId })
    }

    const mediaItems = await this.mediaItemRepository.getByListId({
      mediaListId: args.mediaListId,
      withoutLimit: true,
    })
    if (!mediaItems.items.length) {
      throw new BadArgumentsError("Cannot generate recommendations for an empty media list.")
    }

    const mediaIds = Array.from(new Set(mediaItems.items.map(item => item.mediaId)))
    const [mediaRatings, mediaReviews, trackingData] = await Promise.all([
      this.mediaRatingRepository.getByUserIdAndMediaIds({ userId: args.userId, mediaIds }),
      this.mediaReviewRepository.getByUserIdAndMediaIds({ userId: args.userId, mediaIds }),
      this.trackingDataRepository.getByMediaItemIds(mediaItems.items.map(item => item.id)),
    ])
    const getMediaKey = (args: { mediaType: MediaTypeEnum, mediaId: number }) => `${args.mediaType}:${args.mediaId}`
    const ratingByMedia = new Map((mediaRatings ?? []).map(rating => [
      getMediaKey(rating),
      rating.rating,
    ]))
    const reviewByMedia = new Map(mediaReviews.map(review => [
      getMediaKey(review),
      review.content,
    ]))
    const noteByMediaItemId = new Map(trackingData.map(tracking => [tracking.mediaItemId, tracking.note]))

    const items = mediaItems.items.map((item): RecommendationInputItemType | null => {
      const details = item.mediaDetails
      const title = details?.en.title || details?.ru.title
      if (!details || !title) {
        return null
      }

      const releaseYear = details.releaseDate ? Number(details.releaseDate.slice(0, 4)) : undefined
      const mediaKey = getMediaKey(item)
      return {
        title,
        originalTitle: details.en.originalTitle || details.ru.originalTitle || undefined,
        releaseYear: releaseYear && Number.isFinite(releaseYear) ? releaseYear : undefined,
        mediaType: item.mediaType,
        rating: ratingByMedia.get(mediaKey),
        review: reviewByMedia.get(mediaKey),
        note: noteByMediaItemId.get(item.id) || undefined,
      }
    }).filter((item): item is RecommendationInputItemType => item !== null)

    if (!items.length) {
      throw new BadArgumentsError("Cannot generate recommendations without media details.")
    }

    const body = { items, count: args.count }
    if (args.sessionId) {
      return this.recommendationsService.refresh({
        sessionId: args.sessionId,
        userId: args.userId,
        body,
      })
    }

    return this.recommendationsService.create({ userId: args.userId, body })
  }

  async create(userId: string, body?: CreateMediaListDto) {
    await this.validateIsMediaListsLimitReached(userId)
    return this.mediaListRepository.create({
      userId,
      isSystem: false,
      body,
    })
  }

  async update(id: string, body: UpdateMediaListDto, userId: string) {
    const isListOwner = await this.isListOwner(id, userId)

    if (!isListOwner) {
      throw new MediaListUnauthorizedError({ userId, mediaListId: id })
    }

    return this.mediaListRepository.update({ id, body })
  }

  async delete(id: string, userId: string) {
    const mediaList = await this.mediaListRepository.getById({ id })
    const isListOwner = await this.isListOwner(id, userId, mediaList)

    if (!isListOwner) {
      throw new MediaListUnauthorizedError({ userId, mediaListId: id })
    }

    if (mediaList.isSystem) {
      throw new SystemMediaListDeletionError({ mediaListId: id })
    }

    return this.mediaListRepository.delete(id)
  }

  async createClone(
    id: string,
    userId: string,
    body: CreateMediaListCloneDto,
  ) {
    await this.validateIsMediaListsLimitReached(userId)

    const mediaList = await this.mediaListRepository.getById({ id })

    if (!mediaList) {
      throw new MediaListNotFoundError({ mediaListId: id })
    }

    if (mediaList.accessLevel === MediaListAccessLevelEnum.PRIVATE && mediaList.userId !== userId) {
      throw new MediaListUnauthorizedError({ userId, mediaListId: id })
    }

    const isOwner = mediaList.userId === userId

    return this.drizzleService.runInTransaction(async () => {
      const mediaItems = await this.mediaItemRepository.getByListId({
        mediaListId: id,
        withoutLimit: true,
      })
      const newMediaList = await this.mediaListRepository.create({
        userId,
        isSystem: false,
        body: {
          title: body.title,
          accessLevel: MediaListAccessLevelEnum.PRIVATE,
        },
      })

      if (mediaItems.items.length > 0) {
        const trackingDataByMediaItemId = new Map(
          (await this.trackingDataRepository.getByMediaItemIds(mediaItems.items.map(el => el.id)))
            .map(el => [el.mediaItemId, el]),
        )

        const createdMediaItems = await this.mediaItemRepository.createMany(mediaItems.items.map(el => ({
          mediaId: el.mediaId,
          mediaType: el.mediaType,
          mediaListId: newMediaList.id,
          mediaDetailsId: el.mediaDetailsId,
          currentStatus: body.isKeepStatus
            ? trackingDataByMediaItemId.get(el.id)?.currentStatus
            : undefined,
          note: isOwner
            ? trackingDataByMediaItemId.get(el.id)?.note
            : undefined,
        })))

        const createdMediaItemByKey = new Map(
          createdMediaItems.map(el => [`${el.mediaType}-${el.mediaId}`, el]),
        )

        await mapTasksWithConcurrency({
          items: mediaItems.items.filter(el => el.mediaType === MediaTypeEnum.TV),
          concurrency: 10,
          fn: async (sourceMediaItem) => {
            const targetMediaItem = createdMediaItemByKey.get(`${sourceMediaItem.mediaType}-${sourceMediaItem.mediaId}`)

            if (!targetMediaItem) {
              return
            }

            if (isOwner) {
              const clonedCycles = await this.tvWatchCyclesService.cloneByMediaItemId({
                sourceMediaItemId: sourceMediaItem.id,
                targetMediaItemId: targetMediaItem.id,
                targetUserId: userId,
              })

              if (clonedCycles.length) {
                return
              }
            }

            await this.tvWatchCycleRepository.create({
              mediaItemId: targetMediaItem.id,
              userId,
              mediaId: targetMediaItem.mediaId,
              cycleNumber: 1,
            })
          },
        })
      }

      return this.mediaListRepository.getById({
        id: newMediaList.id,
        currentUserId: userId,
      })
    })
  }

  async createLike(mediaListId: string, userId: string): Promise<MediaListLikeDto> {
    const mediaList = await this.mediaListRepository.getById({ id: mediaListId })
    const isListOwner = await this.isListOwner(mediaListId, userId, mediaList)

    if (isListOwner) {
      throw new MediaListSelfLikeError({ userId, mediaListId })
    }

    const mediaListLike = await this.mediaListRepository.createLike({
      mediaListId,
      userId,
    })

    if (mediaList) {
      await this.notificationsService.create({
        userId: mediaList.userId,
        type: NotificationTypeEnum.MEDIA_LIST_LIKE,
        meta: {
          actorUserId: userId,
          mediaListId: mediaList.id,
          mediaListLikeId: mediaListLike.id,
        },
        createdAt: mediaListLike.createdAt,
      }).catch((err) => {
        this.logger.error(err, "Failed to create media list like notification")
      })
    }

    return { ...mediaListLike, mediaListHumanFriendlyId: mediaList.humanFriendlyId }
  }

  async deleteLike(mediaListId: string, userId: string): Promise<MediaListLikeDto> {
    const mediaList = await this.mediaListRepository.getById({ id: mediaListId })
    const isListOwner = await this.isListOwner(mediaListId, userId, mediaList)

    if (isListOwner) {
      throw new MediaListSelfDislikeError({ userId, mediaListId })
    }

    const mediaListLike = await this.mediaListRepository.deleteLike({
      mediaListId,
      userId,
    })
    return { ...mediaListLike, mediaListHumanFriendlyId: mediaList.humanFriendlyId }
  }
}
