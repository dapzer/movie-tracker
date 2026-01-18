import {
  CreateNotificationArgsType,
  MediaDetailsType,
  MediaTypeEnum,
  NotificationMediaReleaseEpisodeType,
  NotificationTypeEnum,
} from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable, Logger, OnModuleInit } from "@nestjs/common"
import { Interval } from "@nestjs/schedule"
import { getTmdbDetailApi, getTmdbDetailsWithSeasonsApi } from "@/api/tmdb/tmdbApi"
import { TmdbDetailsWithSeasonsResponseType } from "@/api/tmdb/tmdbApiTypes"
import {
  MediaDetailsRepositoryInterface,
  MediaDetailsRepositorySymbol,
} from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import {
  MediaRatingRepositoryInterface,
  MediaRatingRepositorySymbol,
} from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import {
  ReleaseSubscriptionRepositoryInterface,
  ReleaseSubscriptionRepositorySymbol,
} from "@/repositories/releaseSubscription/ReleaseSubscriptionRepositoryInterface"
import { NotificationService } from "@/routes/notification/notification.service"
import { convertArrayToChunks } from "@/shared/utils/convertArrayToChunks"
import { convertMediaDetailsToMediaDetailsInfo } from "@/shared/utils/convertMediaDetailsToMediaDetailsInfo"
import { getMillisecondsFromHours } from "@/shared/utils/getMillisecondsFromHours"

interface NotificationType {
  subscriptionId: string
  body: CreateNotificationArgsType
}

type NotificationsToSendType = Record<MediaTypeEnum, NotificationType[]>

@Injectable()
export class MediaDetailsService implements OnModuleInit {
  private updatingProgress = {
    successfulUpdates: 0,
    failedUpdatesByApi: 0,
    failedUpdatesByDb: 0,
  }

  private notificationsToSend: NotificationsToSendType

  private readonly logger = new Logger("MediaDetailsService")

  constructor(
    @Inject(MediaDetailsRepositorySymbol)
    private mediaDetailsRepository: MediaDetailsRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
    @Inject(ReleaseSubscriptionRepositorySymbol)
    private readonly releaseSubscriptionRepository: ReleaseSubscriptionRepositoryInterface,
    private readonly notificationService: NotificationService,
  ) {
    this.resetNotificationsToSend()
  }

  async onModuleInit() {
    // this.createOrUpdateAllMediaItemsDetails();
  }

  @Interval(getMillisecondsFromHours(8))
  async autoUpdateAllMediaDetails() {
    this.createOrUpdateAllMediaItemsDetails()
  }

  private resetNotificationsToSend() {
    this.notificationsToSend = {
      tv: [],
      movie: [],
    }
  }

  private async getMediaDetailsItemFromApi(
    mediaId: number,
    mediaType: MediaTypeEnum,
    language: string,
  ): Promise<TmdbDetailsWithSeasonsResponseType | null> {
    try {
      if (mediaType === MediaTypeEnum.TV) {
        return getTmdbDetailsWithSeasonsApi({
          mediaId,
          mediaType,
          language,
        })
      }

      const details = await getTmdbDetailApi({
        mediaId,
        mediaType,
        language,
      })

      return { details }
    }
    catch {
      return null
    }
  }

  private async getAllMediaDetails(mediaId: number, mediaType: MediaTypeEnum) {
    try {
      const [ru, en] = await Promise.all([
        this.getMediaDetailsItemFromApi(mediaId, mediaType, "ru"),
        this.getMediaDetailsItemFromApi(mediaId, mediaType, "en"),
      ])

      return {
        ru,
        en,
      }
    }
    catch {
      this.logger.error(`Failed to get data from TMDB with id ${mediaId} and type ${mediaType}.`)

      return {
        ru: null,
        en: null,
      }
    }
  }

  private async handeSubscriptionNotifications(args: {
    mediaDetails: MediaDetailsType
    previousMediaDetails: MediaDetailsType | null
  }) {
    const subscriptions = await this.releaseSubscriptionRepository.getUncompletedByMediaDetailsId({
      mediaDetailsId: args.mediaDetails.id,
    })

    if (subscriptions.length === 0) {
      return
    }

    const statusChanged = args.previousMediaDetails?.en.status && args.mediaDetails.en.status !== args.previousMediaDetails?.en.status
    const today = new Date()
    today.setHours(0, 0, 0, 0)

    for (const subscription of subscriptions) {
      let releaseChanged
      const releasedEpisodes: Array<NotificationMediaReleaseEpisodeType> = []

      if (args.mediaDetails.mediaType === MediaTypeEnum.TV) {
        for (const season of args.mediaDetails.en.seasons || []) {
          for (const episode of season.episodes || []) {
            if (episode.airDate) {
              const episodeAirDate = new Date(episode.airDate)
              const subscriptionUpdatedAt = new Date(subscription.lastReleasedAt || subscription.createdAt)

              const isAfterSubscription = episodeAirDate > subscriptionUpdatedAt
              const isNotLaterThanToday = episodeAirDate <= today

              if (isAfterSubscription && isNotLaterThanToday) {
                releasedEpisodes.push({
                  seasonNumber: season.seasonNumber,
                  episodeNumber: episode.episodeNumber,
                })

                if (!releaseChanged) {
                  releaseChanged = true
                }
              }

              if (!isNotLaterThanToday) {
                break
              }
            }
          }
        }
      }
      else {
        if (args.mediaDetails.en.releaseDate) {
          const releaseDate = new Date(args.mediaDetails.en.releaseDate)
          const subscriptionUpdatedAt = new Date(subscription.lastReleasedAt || subscription.createdAt)

          const isAfterSubscription = releaseDate > subscriptionUpdatedAt
          const isNotLaterThanToday = releaseDate <= today

          if (isAfterSubscription && isNotLaterThanToday) {
            releaseChanged = true
          }
        }
      }

      if (releaseChanged) {
        this.notificationsToSend[args.mediaDetails.mediaType].push({
          subscriptionId: subscription.id,
          body: {
            userId: subscription.userId,
            type: NotificationTypeEnum.MEDIA_RELEASE,
            meta: {
              mediaDetailsId: args.mediaDetails.id,
              ...(args.mediaDetails.mediaType === MediaTypeEnum.TV
                ? {
                    episodes: releasedEpisodes,
                  }
                : {}
              ),
            },
          },
        })
      }

      if (statusChanged) {
        this.notificationsToSend[args.mediaDetails.mediaType].push({
          subscriptionId: subscription.id,
          body: {
            userId: subscription.userId,
            type: NotificationTypeEnum.MEDIA_STATUS_UPDATE,
            meta: {
              mediaDetailsId: args.mediaDetails.id,
              previousStatus: args.previousMediaDetails?.en.status || "",
              currentStatus: args.mediaDetails.en.status || "",
            },
          },
        })
      }
    }
  }

  private async sendNotifications() {
    const allNotifications = [
      ...this.notificationsToSend[MediaTypeEnum.MOVIE],
      ...this.notificationsToSend[MediaTypeEnum.TV],
    ]

    if (allNotifications.length > 0) {
      this.logger.log(`Sending ${allNotifications.length} notifications.`)
      try {
        await this.notificationService.createBulk(allNotifications.map(el => el.body))
        await Promise.all(
          Object.entries(this.notificationsToSend).map(([mediaType, notifications]) => {
            return this.releaseSubscriptionRepository.updateManyByIds(
              {
                ids: notifications.map(el => el.subscriptionId),
                lastReleasedAt: new Date(),
                completedAt: mediaType === MediaTypeEnum.MOVIE
                  ? new Date()
                  : undefined,
              },
            )
          }),
        )
        this.resetNotificationsToSend()

        this.logger.log("Notifications sent successfully.")
      }
      catch (e) {
        this.logger.error(`Failed to send notifications: ${e}`)
      }
    }
  }

  async createOrUpdateMediaDetails(
    args: {
      mediaId: number
      mediaType: MediaTypeEnum
      currentDetails?: MediaDetailsType
      skipError?: boolean
      generateSubscriptionNotifications?: boolean
    },
  ) {
    const { ru, en } = await this.getAllMediaDetails(args.mediaId, args.mediaType)

    if (!ru || !en) {
      this.updatingProgress.failedUpdatesByApi += 1

      if (args.skipError) {
        return null
      }

      throw new HttpException("Media details not found", HttpStatus.NOT_FOUND)
    }

    let mediaDetailsItem: MediaDetailsType | null = args.currentDetails

    if (!mediaDetailsItem) {
      mediaDetailsItem = await this.mediaDetailsRepository.getByMediaData({
        mediaId: args.mediaId,
        mediaType: args.mediaType,
      })
    }

    try {
      if (!mediaDetailsItem) {
        mediaDetailsItem = await this.mediaDetailsRepository.create({
          mediaId: args.mediaId,
          mediaType: args.mediaType,
          mediaDetailsInfoRu: convertMediaDetailsToMediaDetailsInfo(ru),
          mediaDetailsInfoEn: convertMediaDetailsToMediaDetailsInfo(en),
          score: en?.details?.vote_average || 0,
        })
      }
      else {
        mediaDetailsItem = await this.mediaDetailsRepository.update({
          mediaId: args.mediaId,
          mediaType: args.mediaType,
          mediaDetailsInfoRu: convertMediaDetailsToMediaDetailsInfo(ru),
          mediaDetailsInfoEn: convertMediaDetailsToMediaDetailsInfo(en),
          score: en?.details?.vote_average || 0,
        })
      }

      if (args.generateSubscriptionNotifications) {
        await this.handeSubscriptionNotifications({
          mediaDetails: mediaDetailsItem,
          previousMediaDetails: args.currentDetails,
        })
      }

      this.updatingProgress.successfulUpdates += 1

      return mediaDetailsItem
    }
    catch {
      this.updatingProgress.failedUpdatesByDb += 1

      if (args.skipError) {
        return null
      }

      throw new HttpException(
        "Failed to create or update media details",
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async createOrUpdateAllMediaItemsDetails() {
    const [mediaItems, mediaRatings, mediaDetails] = await Promise.all(
      [
        this.mediaItemRepository.getAllMediaItems(),
        this.mediaRatingRepository.getAllMediaRatings(),
        this.mediaDetailsRepository.getAll(),
      ],
    )
    if (!mediaItems && !mediaRatings) {
      throw new HttpException("Media items not found", HttpStatus.NOT_FOUND)
    }

    const uniqueMediaIdsWithTypes = [
      ...new Map(
        [
          ...mediaItems,
          ...mediaRatings,
          ...mediaDetails,
        ].map(item => [
          `${item.mediaId}-${item.mediaType}`,
          {
            mediaId: item.mediaId,
            mediaType: item.mediaType,
            currentDetails: mediaDetails.find((el) => {
              return el.mediaId === item.mediaId && el.mediaType === item.mediaType
            }),
          },
        ]),
      ).values(),
    ]

    this.logger.log(`Starting media details update for ${uniqueMediaIdsWithTypes.length} media items.`)

    const chunks = convertArrayToChunks(uniqueMediaIdsWithTypes, 20)
    let iteration = 1
    this.updatingProgress = {
      successfulUpdates: 0,
      failedUpdatesByApi: 0,
      failedUpdatesByDb: 0,
    }

    for (const chunk of chunks) {
      const promiseArr = chunk.map((el) => {
        return this.createOrUpdateMediaDetails({
          mediaId: el.mediaId,
          mediaType: el.mediaType,
          currentDetails: el.currentDetails,
          skipError: true,
          generateSubscriptionNotifications: true,
        },
        )
      })

      await Promise.all(promiseArr)

      if (iteration < chunks.length) {
        iteration += 1
        await new Promise(resolve => setTimeout(resolve, 1000))
      }
    }

    this.logger.log(
      `Successful updates: ${this.updatingProgress.successfulUpdates} / Failed updates by API: ${this.updatingProgress.failedUpdatesByApi} / Failed updates by DB: ${this.updatingProgress.failedUpdatesByDb}`,
    )

    await this.sendNotifications()

    return this.updatingProgress
  }
}
