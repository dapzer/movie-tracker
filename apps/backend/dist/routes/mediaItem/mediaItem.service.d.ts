import { MediaItemRepositoryInterface } from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { MediaItemDto } from '@/routes/mediaItem/dto/mediaItem.dto';
import { MediaListRepositoryInterface } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { MediaDetailsService } from '@/routes/mediaDetails/mediaDetails.service';
export declare class MediaItemService {
    private readonly mediaListRepository;
    private readonly mediaItemRepository;
    private readonly mediaDetailsService;
    constructor(mediaListRepository: MediaListRepositoryInterface, mediaItemRepository: MediaItemRepositoryInterface, mediaDetailsService: MediaDetailsService);
    private isMediaItemOwner;
    createMediaItem(mediaId: number, mediaType: MediaItemDto['mediaType'], mediaListId: string, userId: string): Promise<MediaItemDto>;
    getMediaItemsByListId(mediaListId: string, userId: string): Promise<MediaItemDto[]>;
    deleteMediaItem(id: string, userId: string): Promise<MediaItemDto>;
    updateMediaItemTrackingData(id: string, trackingData: MediaItemDto['trackingData'], userId: string): Promise<MediaItemDto>;
}
