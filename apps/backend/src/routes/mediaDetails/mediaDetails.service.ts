import { MediaDetailsType, MediaTypeEnum } from "@movie-tracker/types"
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
import { convertArrayToChunks } from "@/shared/utils/convertArrayToChunks"
import { convertMediaDetailsToMediaDetailsInfo } from "@/shared/utils/convertMediaDetailsToMediaDetailsInfo"
import { getMillisecondsFromHours } from "@/shared/utils/getMillisecondsFromHours"

@Injectable()
export class MediaDetailsService implements OnModuleInit {
  private updatingProgress = {
    successfulUpdates: 0,
    failedUpdatesByApi: 0,
    failedUpdatesByDb: 0,
  }

  private readonly logger = new Logger("MediaDetailsService")

  constructor(
    @Inject(MediaDetailsRepositorySymbol)
    private mediaDetailsRepository: MediaDetailsRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
  ) {
  }

  async onModuleInit() {
    // this.createOrUpdateAllMediaItemsDetails();
  }

  @Interval(getMillisecondsFromHours(8))
  async autoUpdateAllMediaDetails() {
    this.createOrUpdateAllMediaItemsDetails()
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
    catch (err) {
      this.logger.error(`Failed to get data from TMDB with id ${mediaId} and type ${mediaType}.`)

      return {
        ru: null,
        en: null,
      }
    }
  }

  async createOrUpdateMediaDetails(
    mediaId: number,
    mediaType: MediaTypeEnum,
    skipError: boolean = false,
  ) {
    const { ru, en } = await this.getAllMediaDetails(mediaId, mediaType)

    if (!ru || !en) {
      this.updatingProgress.failedUpdatesByApi += 1

      if (skipError) {
        return null
      }

      throw new HttpException("Media details not found", HttpStatus.NOT_FOUND)
    }

    const mediaDetails = await this.mediaDetailsRepository.getMediaDetailsItem(
      mediaId,
      mediaType,
    )

    let mediaDetailsItem: MediaDetailsType | null = null

    try {
      if (!mediaDetails) {
        mediaDetailsItem = await this.mediaDetailsRepository.createMediaDetails(
          mediaId,
          mediaType,
          convertMediaDetailsToMediaDetailsInfo(ru),
          convertMediaDetailsToMediaDetailsInfo(en),
          en?.details?.vote_average || 0,
        )
      }
      else {
        mediaDetailsItem = await this.mediaDetailsRepository.updateMediaDetails(
          mediaId,
          mediaType,
          convertMediaDetailsToMediaDetailsInfo(ru),
          convertMediaDetailsToMediaDetailsInfo(en),
          en?.details?.vote_average || 0,
        )
      }

      this.updatingProgress.successfulUpdates += 1

      return mediaDetailsItem
    }
    catch {
      this.updatingProgress.failedUpdatesByDb += 1

      if (skipError) {
        return null
      }

      throw new HttpException(
        "Failed to create or update media details",
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
    }
  }

  async createOrUpdateAllMediaItemsDetails() {
    const [mediaItems, mediaRatings] = await Promise.all(
      [this.mediaItemRepository.getAllMediaItems(), this.mediaRatingRepository.getAllMediaRatings(),
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
        ].map(item => [
          `${item.mediaId}-${item.mediaType}`,
          { mediaId: item.mediaId, mediaType: item.mediaType },
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
      const promiseArr = chunk.map((mediaItem) => {
        return this.createOrUpdateMediaDetails(
          mediaItem.mediaId,
          mediaItem.mediaType,
          true,
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

    return this.updatingProgress
  }
}
