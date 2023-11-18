import { MediaItem, MediaTypeEnum } from '@prisma/client';
import { MediaItemTrackingDataDto } from '@/routes/mediaItem/dto/mediaItemTrackingDataDto.dto';
export declare class MediaItemDto implements MediaItem {
    id: string;
    mediaDetailsId: string;
    mediaId: number;
    mediaType: MediaTypeEnum;
    mediaListId: string;
    trackingData: MediaItemTrackingDataDto;
    createdAt: Date;
    updatedAt: Date;
}
