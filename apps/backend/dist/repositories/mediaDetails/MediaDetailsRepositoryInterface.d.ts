import { MediaDetailsDto } from '@/routes/mediaDetails/dto/mediaDetails.dto';
import { MediaDetailsInfoDto } from '@/routes/mediaDetails/dto/mediaDetailsInfo.dto';
export declare const MediaDetailsRepositorySymbol: unique symbol;
export interface MediaDetailsRepositoryInterface {
    createMediaDetails: (mediaId: number, mediaType: MediaDetailsDto['mediaType'], mediaDetailsInfoRu: MediaDetailsInfoDto, mediaDetailsInfoEn: MediaDetailsInfoDto, score: number) => Promise<MediaDetailsDto>;
    updateMediaDetails: (mediaId: number, mediaType: MediaDetailsDto['mediaType'], mediaDetailsInfoRu: MediaDetailsInfoDto, mediaDetailsInfoEn: MediaDetailsInfoDto, score: number) => Promise<MediaDetailsDto>;
    getMediaDetailsItem: (mediaId: number, mediaType: MediaDetailsDto['mediaType']) => Promise<MediaDetailsDto>;
}
