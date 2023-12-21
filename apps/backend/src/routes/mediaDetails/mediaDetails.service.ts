import {
  HttpException,
  HttpStatus,
  Inject,
  Injectable,
  Logger,
  OnModuleInit,
} from '@nestjs/common';
import {
  MediaDetailsRepositoryInterface,
  MediaDetailsRepositorySymbol,
} from '@/repositories/mediaDetails/MediaDetailsRepositoryInterface';
import {
  MediaItemRepositoryInterface,
  MediaItemRepositorySymbol,
} from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { ConfigService } from '@nestjs/config';
import { generateApiUrl } from '@movie-tracker/utils';
import { convertMediaDetailsToMediaDetailsInfo } from '@/shared/utils/convertMediaDetailsToMediaDetailsInfo';
import { convertArrayToChunks } from '@/shared/utils/convertArrayToChunks';
import { Interval } from '@nestjs/schedule';
import { getMillisecondsFromHours } from '@/shared/utils/getMillisecondsFromHours';
import {
  TmdbMediaDetailsType,
  MediaDetailsType,
  MediaItemType,
  MediaTypeEnum,
} from '@movie-tracker/types';

@Injectable()
export class MediaDetailsService implements OnModuleInit {
  private updatingProgress = {
    successfulUpdates: 0,
    failedUpdatesByApi: 0,
    failedUpdatesByDb: 0,
  };
  private readonly logger = new Logger('MediaDetailsService');
  private getApiUrl = generateApiUrl(this.configService.get('TMDB_API_URL'), {
    api_key: this.configService.get('TMDB_API_KEY'),
  });

  constructor(
    @Inject(MediaDetailsRepositorySymbol)
    private mediaDetailsRepository: MediaDetailsRepositoryInterface,
    @Inject(MediaItemRepositorySymbol)
    private readonly mediaItemRepository: MediaItemRepositoryInterface,
    private readonly configService: ConfigService,
  ) {}

  async onModuleInit() {
    this.createOrUpdateAllMediaItemsDetails();
  }

  @Interval(getMillisecondsFromHours(8))
  async autoUpdateAllMediaDetails() {
    this.createOrUpdateAllMediaItemsDetails();
  }

  private async getMediaDetailsItemFromApi(
    mediaId: number,
    mediaType: MediaTypeEnum,
    language: string,
  ): Promise<TmdbMediaDetailsType | null> {
    const response = await fetch(
      this.getApiUrl(`/${mediaType.toLowerCase()}/${mediaId}`, {
        language,
      }),
    );

    if (response.ok) {
      return await response.json();
    } else {
      return null;
    }
  }

  private async getAllMediaDetails(mediaId: number, mediaType: MediaTypeEnum) {
    try {
      const [ru, en] = await Promise.all([
        this.getMediaDetailsItemFromApi(mediaId, mediaType, 'ru'),
        this.getMediaDetailsItemFromApi(mediaId, mediaType, 'en'),
      ]);

      return {
        ru,
        en,
      };
    } catch (error) {
      this.logger.error('Failed to get data from TMDB.');

      return {
        ru: null,
        en: null,
      };
    }
  }

  async createOrUpdateMediaDetails(
    mediaId: number,
    mediaType: MediaTypeEnum,
    skipError: boolean = false,
    mediaItem?: MediaItemType,
  ) {
    const { ru, en } = await this.getAllMediaDetails(mediaId, mediaType);

    if (!ru || !en) {
      this.updatingProgress.failedUpdatesByApi += 1;

      if (skipError) {
        return null;
      }

      throw new HttpException('Media details not found', HttpStatus.NOT_FOUND);
    }

    const mediaDetails = await this.mediaDetailsRepository.getMediaDetailsItem(
      mediaId,
      mediaType,
    );

    let mediaDetailsItem: MediaDetailsType | null = null;

    try {
      if (!mediaDetails) {
        mediaDetailsItem = await this.mediaDetailsRepository.createMediaDetails(
          mediaId,
          mediaType,
          convertMediaDetailsToMediaDetailsInfo(ru),
          convertMediaDetailsToMediaDetailsInfo(en),
          en.vote_average || 0,
        );
      }

      mediaDetailsItem = await this.mediaDetailsRepository.updateMediaDetails(
        mediaId,
        mediaType,
        convertMediaDetailsToMediaDetailsInfo(ru),
        convertMediaDetailsToMediaDetailsInfo(en),
        en?.vote_average || 0,
      );

      if (mediaDetails && mediaItem && !mediaItem?.mediaDetailsId) {
        await this.mediaItemRepository.updateMediaItem(mediaItem.id, {
          mediaDetailsId: mediaDetailsItem.id,
        });
      }

      this.updatingProgress.successfulUpdates += 1;

      return mediaDetailsItem;
    } catch (error) {
      this.updatingProgress.failedUpdatesByDb += 1;

      if (skipError) {
        return null;
      }

      throw new HttpException(
        'Failed to create or update media details',
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }

  async createOrUpdateAllMediaItemsDetails() {
    const mediaItems = await this.mediaItemRepository.getAllMediaItems();

    if (!mediaItems) {
      throw new HttpException('Media items not found', HttpStatus.NOT_FOUND);
    }

    const chunks = convertArrayToChunks(mediaItems, 20);
    let iteration = 1;
    this.updatingProgress = {
      successfulUpdates: 0,
      failedUpdatesByApi: 0,
      failedUpdatesByDb: 0,
    };

    for (const chunk of chunks) {
      const promiseArr = chunk.map((mediaItem) => {
        return this.createOrUpdateMediaDetails(
          mediaItem.mediaId,
          mediaItem.mediaType,
          true,
          mediaItem,
        );
      });

      await Promise.all(promiseArr);

      if (iteration < chunks.length) {
        iteration += 1;
        await new Promise((resolve) => setTimeout(resolve, 1000));
      }
    }

    this.logger.log(
      `Successful updates: ${this.updatingProgress.successfulUpdates} / Failed updates by API: ${this.updatingProgress.failedUpdatesByApi} / Failed updates by DB: ${this.updatingProgress.failedUpdatesByDb}`,
    );

    return this.updatingProgress;
  }
}
