import { MediaDetailsInfo } from '@prisma/client';
import { MediaDetailsSeasonDto } from '@/routes/mediaDetails/dto/mediaDetailsSeason.dto';
export declare class MediaDetailsInfoDto implements MediaDetailsInfo {
    title: string;
    originalTitle: string;
    poster: string;
    seasons: MediaDetailsSeasonDto[];
}
