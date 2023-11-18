import { OnModuleInit } from '@nestjs/common';
import { MediaDetailsRepositoryInterface } from '@/repositories/mediaDetails/MediaDetailsRepositoryInterface';
import { MediaItemRepositoryInterface } from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { MediaDetailsDto } from '@/routes/mediaDetails/dto/mediaDetails.dto';
import { ConfigService } from '@nestjs/config';
import { MediaItemDto } from '@/routes/mediaItem/dto/mediaItem.dto';
export declare class MediaDetailsService implements OnModuleInit {
    private mediaDetailsRepository;
    private readonly mediaItemRepository;
    private readonly configService;
    private updatingProgress;
    private readonly logger;
    private getApiUrl;
    constructor(mediaDetailsRepository: MediaDetailsRepositoryInterface, mediaItemRepository: MediaItemRepositoryInterface, configService: ConfigService);
    onModuleInit(): Promise<void>;
    autoUpdateAllMediaDetails(): Promise<void>;
    private getMediaDetailsItemFromApi;
    private getAllMediaDetails;
    createOrUpdateMediaDetails(mediaId: number, mediaType: MediaDetailsDto['mediaType'], skipError?: boolean, mediaItem?: MediaItemDto): Promise<MediaDetailsDto>;
    createOrUpdateAllMediaItemsDetails(): Promise<{
        successfulUpdates: number;
        failedUpdatesByApi: number;
        failedUpdatesByDb: number;
    }>;
}
