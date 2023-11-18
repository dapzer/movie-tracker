import { StatusNameEnum, TrackingData } from '@prisma/client';
import { MediaItemSeriesInfoDto } from '@/routes/mediaItem/dto/mediaItemSeriesInfo.dto';
import { MediaItemSiteToViewDto } from '@/routes/mediaItem/dto/mediaItemSiteToView.dto';
export declare class MediaItemTrackingDataDto implements TrackingData {
    currentStatus: StatusNameEnum;
    note: string;
    score: number | null;
    seriesInfo: MediaItemSeriesInfoDto;
    sitesToView: Array<MediaItemSiteToViewDto>;
}
