import { Buffer } from "node:buffer"
import {
  DataImportBucketType,
  DataImportEpisodeProgressType,
  DataImportMediaType,
  DataImportProcessSummaryType,
  DataImportRatingType,
  DataImportRawResultType,
  DataImportReviewType,
  DataImportSourceEnum,
  DataImportStatusEnum,
  MEDIA_REVIEW_CONTENT_MAX_LENGTH,
  MEDIA_REVIEW_CONTENT_MIN_LENGTH,
  MediaItemStatusNameEnum,
  MediaItemTvProgressType,
  MediaListAccessLevelEnum,
  MediaReviewStatus,
  MediaTypeEnum,
} from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  DataImportRepositoryInterface,
  DataImportRepositorySymbol,
} from "@/repositories/dataImport/DataImportRepositoryInterface"
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from "@/repositories/mediaItem/MediaItemRepositoryInterface"
import {
  MediaRatingRepositoryInterface,
  MediaRatingRepositorySymbol,
} from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { ProcessDataImportDto } from "@/services/dataImport/dto/processDataImport.dto"
import { DataImportProvidersService } from "@/services/dataImport/providers/providers.service"
import { DrizzleService } from "@/services/drizzle/drizzle.service"
import { MediaItemsService } from "@/services/mediaItems/mediaItems.service"
import { MediaListsService } from "@/services/mediaLists/mediaLists.service"
import { MediaRatingsService } from "@/services/mediaRatings/mediaRatings.service"
import { MediaReviewsService } from "@/services/mediaReviews/mediaReviews.service"
import {
  DataImportInvalidStatusError,
  DataImportNotFoundError,
  DataImportUnauthorizedError,
} from "@/shared/errors/dataImport"
import { MediaReviewAlreadyExistsError } from "@/shared/errors/mediaReview"
import { extractArchiveData } from "@/shared/utils/extractArchiveData"
import { mapTasksWithConcurrency } from "@/shared/utils/mapTasksWithConcurrency"

const IMPORT_WRITE_CONCURRENCY = 10

@Injectable()
export class DataImportService {
  constructor(
    private readonly providersService: DataImportProvidersService,
    @Inject(DataImportRepositorySymbol)
    private readonly dataImportRepository: DataImportRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
    private readonly mediaItemsService: MediaItemsService,
    private readonly mediaListsService: MediaListsService,
    private readonly mediaRatingsService: MediaRatingsService,
    private readonly mediaReviewsService: MediaReviewsService,
    private readonly drizzleService: DrizzleService,
  ) {}

  async import(args: { userId: string, source: DataImportSourceEnum, archive: Buffer | Uint8Array }): Promise<{ importId: string, result: DataImportRawResultType }> {
    const provider = this.providersService.findService(args.source)
    const files = await extractArchiveData(args.archive)

    provider.validateFiles({ files })

    const result = await provider.import({ files })
    const dataImport = await this.dataImportRepository.create({
      userId: args.userId,
      source: args.source,
      result,
    })

    return { importId: dataImport.id, result }
  }

  async getById(args: { id: string, userId: string }) {
    const dataImport = await this.dataImportRepository.getById({ id: args.id })

    if (!dataImport) {
      throw new DataImportNotFoundError({ dataImportId: args.id })
    }

    if (dataImport.userId !== args.userId) {
      throw new DataImportUnauthorizedError({ userId: args.userId, dataImportId: args.id })
    }

    return dataImport
  }

  async getByUserId(args: { userId: string, limit?: number, offset?: number }) {
    return this.dataImportRepository.getByUserId(args)
  }

  private toMediaType(type: DataImportMediaType["type"]): MediaTypeEnum {
    return MediaTypeEnum[type.toUpperCase() as keyof typeof MediaTypeEnum]
  }

  private getLastWatchedTvProgress(episodes?: DataImportEpisodeProgressType[]): MediaItemTvProgressType | undefined {
    const watched = episodes?.filter(episode => episode.status === "watched")

    if (!watched?.length) {
      return undefined
    }

    const last = watched.reduce((a, b) => {
      const isSeasonHigher = b.seasonNumber > a.seasonNumber
      const isSameSeason = b.seasonNumber === a.seasonNumber
      const isEpisodeHigher = b.episodeNumber > a.episodeNumber

      return (isSeasonHigher || (isSameSeason && isEpisodeHigher)) ? b : a
    })

    return { currentSeason: last.seasonNumber, currentEpisode: last.episodeNumber }
  }

  private async createMediaItemsFromBucket(args: {
    userId: string
    bucket: DataImportBucketType<DataImportMediaType>
    mediaListId: string
    status: MediaItemStatusNameEnum
  }) {
    if (!args.bucket.success.length) {
      return { created: 0, skipped: [] }
    }

    const existingMediaIds = new Set(await this.mediaItemRepository.getMediaIdsByListId({
      mediaListId: args.mediaListId,
    }))

    const newMedia = args.bucket.success.filter(media => !existingMediaIds.has(media.ids.tmdbId))
    const skipped = args.bucket.success
      .filter(media => existingMediaIds.has(media.ids.tmdbId))
      .map(media => media.ids.tmdbId)

    if (!newMedia.length) {
      return { created: 0, skipped }
    }

    const createdMediaItems = await this.mediaItemsService.createBulk({
      userId: args.userId,
      items: newMedia.map(media => ({
        mediaId: media.ids.tmdbId,
        mediaType: this.toMediaType(media.type),
        mediaListId: args.mediaListId,
        currentStatus: args.status,
        note: media.note,
        tvProgress: media.episodesProgress?.length ? this.getLastWatchedTvProgress(media.episodesProgress) : undefined,
        createdAt: media.createdAt ? new Date(media.createdAt) : undefined,
      })),
    })

    return { created: createdMediaItems.length, skipped }
  }

  private toMediaKey(media: DataImportMediaType): string {
    return `${media.type}-${media.ids.tmdbId}`
  }

  private async createRatingsFromBucket(args: {
    userId: string
    ratings: DataImportRatingType[]
  }) {
    const ratingsByKey = new Map<string, DataImportRatingType>()

    for (const rating of args.ratings) {
      const key = this.toMediaKey(rating.media)

      if (!ratingsByKey.has(key)) {
        ratingsByKey.set(key, rating)
      }
    }

    if (!ratingsByKey.size) {
      return { created: 0, skipped: [] }
    }

    const ratings = [...ratingsByKey.values()]

    const existingRatings = await this.mediaRatingRepository.getByUserIdAndMediaIds({
      userId: args.userId,
      mediaIds: ratings.map(rating => rating.media.ids.tmdbId),
    })

    const existingKeys = new Set(
      (existingRatings ?? []).map(rating => `${rating.mediaType}-${rating.mediaId}`),
    )

    const newRatings = ratings.filter(rating => !existingKeys.has(this.toMediaKey(rating.media)))
    const skipped = ratings
      .filter(rating => existingKeys.has(this.toMediaKey(rating.media)))
      .map(rating => rating.media.ids.tmdbId)

    await mapTasksWithConcurrency({
      items: newRatings,
      concurrency: IMPORT_WRITE_CONCURRENCY,
      fn: rating => this.mediaRatingsService.create({
        userId: args.userId,
        body: {
          mediaId: rating.media.ids.tmdbId,
          mediaType: this.toMediaType(rating.media.type),
          rating: rating.value,
        },
        createdAt: rating.createdAt ? new Date(rating.createdAt) : undefined,
      }),
    })

    return { created: newRatings.length, skipped }
  }

  private async createReviewsFromBucket(args: {
    userId: string
    bucket: DataImportBucketType<DataImportReviewType>
  }) {
    if (!args.bucket.success.length) {
      return { created: 0, skipped: [] }
    }

    const skipped: number[] = []
    const processedKeys = new Set<string>()
    const reviewsToCreate: DataImportReviewType[] = []

    for (const review of args.bucket.success) {
      const key = this.toMediaKey(review.media)

      if (processedKeys.has(key)) {
        skipped.push(review.media.ids.tmdbId)
        continue
      }
      processedKeys.add(key)

      if (
        review.content.length < MEDIA_REVIEW_CONTENT_MIN_LENGTH
        || review.content.length > MEDIA_REVIEW_CONTENT_MAX_LENGTH
      ) {
        skipped.push(review.media.ids.tmdbId)
        continue
      }

      reviewsToCreate.push(review)
    }

    const alreadyExistingIds: Array<number> = []

    await mapTasksWithConcurrency({
      items: reviewsToCreate,
      concurrency: IMPORT_WRITE_CONCURRENCY,
      fn: async (review): Promise<void> => {
        try {
          await this.mediaReviewsService.create({
            userId: args.userId,
            body: {
              mediaId: review.media.ids.tmdbId,
              mediaType: this.toMediaType(review.media.type),
              content: review.content,
              isSpoiler: review.isSpoiler ?? false,
              status: MediaReviewStatus.PUBLISHED,
            },
            createdAt: review.createdAt ? new Date(review.createdAt) : undefined,
          })
        }
        catch (error) {
          if (error instanceof MediaReviewAlreadyExistsError) {
            alreadyExistingIds.push(review.media.ids.tmdbId)
          }

          throw error
        }
      },
    })

    skipped.push(...alreadyExistingIds)

    return { created: reviewsToCreate.length - alreadyExistingIds.length, skipped }
  }

  private async importStandardBuckets(args: {
    userId: string
    config: Pick<ProcessDataImportDto, "watched" | "watchList">
    result: DataImportRawResultType
  }) {
    const summary = { createdMediaLists: 0, createdMediaItems: 0, skippedMediaItems: [] as number[] }

    for (const bucketKey of ["watched", "watchList"] as const) {
      const config = args.config[bucketKey]

      if (!config) {
        continue
      }

      let mediaListId = config.mediaListId

      if (!mediaListId) {
        const mediaList = await this.mediaListsService.create(args.userId, {
          title: config.newListTitle!,
          accessLevel: MediaListAccessLevelEnum.PRIVATE,
        })
        mediaListId = mediaList.id
        summary.createdMediaLists += 1
      }

      const bucketResult = await this.createMediaItemsFromBucket({
        userId: args.userId,
        bucket: args.result[bucketKey],
        mediaListId,
        status: config.status,
      })
      summary.createdMediaItems += bucketResult.created
      summary.skippedMediaItems.push(...bucketResult.skipped)
    }

    return summary
  }

  private async importListsBucket(args: {
    userId: string
    config: ProcessDataImportDto["lists"]
    bucket: DataImportRawResultType["lists"]
  }) {
    const summary = {
      createdMediaLists: 0,
      createdMediaItems: 0,
      skippedMediaItems: [] as number[],
      notFoundListIds: [] as string[],
    }

    for (const listConfig of args.config ?? []) {
      const list = args.bucket.success.find(list => list.id === listConfig.id)

      if (!list) {
        summary.notFoundListIds.push(listConfig.id)
        continue
      }

      let mediaListId = listConfig.mediaListId

      if (!mediaListId) {
        const mediaList = await this.mediaListsService.create(args.userId, {
          title: list.title,
          description: list.description,
          accessLevel: list.isPrivate ? MediaListAccessLevelEnum.PRIVATE : MediaListAccessLevelEnum.PUBLIC,
        })
        mediaListId = mediaList.id
        summary.createdMediaLists += 1
      }

      const bucketResult = await this.createMediaItemsFromBucket({
        userId: args.userId,
        bucket: list.items,
        mediaListId,
        status: listConfig.status,
      })
      summary.createdMediaItems += bucketResult.created
      summary.skippedMediaItems.push(...bucketResult.skipped)
    }

    return summary
  }

  private async importRatingsBucket(args: {
    userId: string
    result: DataImportRawResultType
  }) {
    const reviewRates = args.result.reviews.success
      .filter((review): review is DataImportReviewType & { rate: number } => review.rate != null)
      .map(review => ({ media: review.media, value: review.rate, createdAt: review.createdAt }))

    return this.createRatingsFromBucket({
      userId: args.userId,
      ratings: [...args.result.ratings.success, ...reviewRates],
    })
  }

  async process(args: { id: string, userId: string, config: ProcessDataImportDto }): Promise<DataImportProcessSummaryType> {
    const dataImport = await this.getById({ id: args.id, userId: args.userId })

    const existingMediaListIds = [
      args.config.watched?.mediaListId,
      args.config.watchList?.mediaListId,
      ...(args.config.lists?.map(list => list.mediaListId) ?? []),
    ].filter((id): id is string => Boolean(id))

    await Promise.all(existingMediaListIds.map(id => this.mediaListsService.validateIsListOwner(id, args.userId)))

    const listsToCreateCount = [args.config.watched, args.config.watchList]
      .filter(config => config && !config.mediaListId)
      .length
      + (args.config.lists?.filter(list => !list.mediaListId).length ?? 0)

    await this.mediaListsService.validateIsMediaListsLimitReached(args.userId, listsToCreateCount)

    const acquired = await this.dataImportRepository.acquireProcessing({ id: args.id })

    if (!acquired) {
      const current = await this.dataImportRepository.getById({ id: args.id })
      throw new DataImportInvalidStatusError({ dataImportId: args.id, status: current?.status ?? dataImport.status })
    }

    const summary: DataImportProcessSummaryType = {
      createdMediaLists: 0,
      createdMediaItems: 0,
      skippedMediaItems: [],
      notFoundListIds: [],
      createdRatings: 0,
      skippedRatings: [],
      createdReviews: 0,
      skippedReviews: [],
    }

    try {
      await this.drizzleService.runInTransaction(async () => {
        const standardResult = await this.importStandardBuckets({
          userId: args.userId,
          config: args.config,
          result: dataImport.result,
        })
        summary.createdMediaLists += standardResult.createdMediaLists
        summary.createdMediaItems += standardResult.createdMediaItems
        summary.skippedMediaItems.push(...standardResult.skippedMediaItems)

        const listsResult = await this.importListsBucket({
          userId: args.userId,
          config: args.config.lists,
          bucket: dataImport.result.lists,
        })
        summary.createdMediaLists += listsResult.createdMediaLists
        summary.createdMediaItems += listsResult.createdMediaItems
        summary.skippedMediaItems.push(...listsResult.skippedMediaItems)
        summary.notFoundListIds.push(...listsResult.notFoundListIds)

        if (args.config.ratings) {
          const ratingsResult = await this.importRatingsBucket({
            userId: args.userId,
            result: dataImport.result,
          })
          summary.createdRatings += ratingsResult.created
          summary.skippedRatings.push(...ratingsResult.skipped)
        }

        if (args.config.reviews) {
          const reviewsResult = await this.createReviewsFromBucket({
            userId: args.userId,
            bucket: dataImport.result.reviews,
          })
          summary.createdReviews += reviewsResult.created
          summary.skippedReviews.push(...reviewsResult.skipped)
        }
      })

      await this.dataImportRepository.updateStatus({
        id: args.id,
        status: DataImportStatusEnum.COMPLETED,
        processedAt: new Date(),
      })

      return summary
    }
    catch (error) {
      await this.dataImportRepository.updateStatus({ id: args.id, status: DataImportStatusEnum.FAILED })
      throw error
    }
  }
}
