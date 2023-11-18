import { MediaDetailsRepositoryInterface } from '@/repositories/mediaDetails/MediaDetailsRepositoryInterface';
import { MediaDetailsDto } from '@/routes/mediaDetails/dto/mediaDetails.dto';
import { MediaDetailsInfoDto } from '@/routes/mediaDetails/dto/mediaDetailsInfo.dto';
import { PrismaService } from '@/services/prisma/prisma.service';
export declare class PrismaMediaDetailsRepository implements MediaDetailsRepositoryInterface {
    private readonly prismaService;
    constructor(prismaService: PrismaService);
    createMediaDetails(mediaId: number, mediaType: MediaDetailsDto['mediaType'], mediaDetailsInfoRu: MediaDetailsInfoDto, mediaDetailsInfoEn: MediaDetailsInfoDto, score: number): Promise<{
        id: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    } & {
        en: {
            title: string;
            originalTitle: string;
            poster: string;
        } & {
            seasons: {
                air_date: string;
                episode_count: number;
                id: number;
                name: string;
                overview: string;
                poster_path: string;
                season_number: number;
                vote_average: number;
            }[];
        };
        ru: {
            title: string;
            originalTitle: string;
            poster: string;
        } & {
            seasons: {
                air_date: string;
                episode_count: number;
                id: number;
                name: string;
                overview: string;
                poster_path: string;
                season_number: number;
                vote_average: number;
            }[];
        };
    }>;
    updateMediaDetails(mediaId: number, mediaType: MediaDetailsDto['mediaType'], mediaDetailsInfoRu: MediaDetailsInfoDto, mediaDetailsInfoEn: MediaDetailsInfoDto, score: number): Promise<{
        id: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    } & {
        en: {
            title: string;
            originalTitle: string;
            poster: string;
        } & {
            seasons: {
                air_date: string;
                episode_count: number;
                id: number;
                name: string;
                overview: string;
                poster_path: string;
                season_number: number;
                vote_average: number;
            }[];
        };
        ru: {
            title: string;
            originalTitle: string;
            poster: string;
        } & {
            seasons: {
                air_date: string;
                episode_count: number;
                id: number;
                name: string;
                overview: string;
                poster_path: string;
                season_number: number;
                vote_average: number;
            }[];
        };
    }>;
    getMediaDetailsItem(mediaId: number, mediaType: MediaDetailsDto['mediaType']): Promise<{
        id: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        score: number;
        createdAt: Date;
        updatedAt: Date;
    } & {
        en: {
            title: string;
            originalTitle: string;
            poster: string;
        } & {
            seasons: {
                air_date: string;
                episode_count: number;
                id: number;
                name: string;
                overview: string;
                poster_path: string;
                season_number: number;
                vote_average: number;
            }[];
        };
        ru: {
            title: string;
            originalTitle: string;
            poster: string;
        } & {
            seasons: {
                air_date: string;
                episode_count: number;
                id: number;
                name: string;
                overview: string;
                poster_path: string;
                season_number: number;
                vote_average: number;
            }[];
        };
    }>;
}
