import { PrismaService } from '@/services/prisma/prisma.service';
import { MediaItemRepositoryInterface } from '@/repositories/mediaItem/MediaItemRepositoryInterface';
import { MediaItemDto } from '@/routes/mediaItem/dto/mediaItem.dto';
export declare class PrismaMediaItemRepository implements MediaItemRepositoryInterface {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllMediaItems(): Promise<({
        id: string;
        mediaListId: string;
        mediaDetailsId: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        createdAt: Date;
        updatedAt: Date;
    } & {
        trackingData: {
            currentStatus: import("@prisma/client").$Enums.StatusNameEnum;
            note: string;
            score: number;
        } & {
            sitesToView: {
                url: string;
            }[];
            seriesInfo: {
                currentSeason: number;
                currentEpisode: number;
            };
        };
    })[]>;
    getMediaItemById(id: string): Promise<{
        id: string;
        mediaListId: string;
        mediaDetailsId: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        createdAt: Date;
        updatedAt: Date;
    } & {
        trackingData: {
            currentStatus: import("@prisma/client").$Enums.StatusNameEnum;
            note: string;
            score: number;
        } & {
            sitesToView: {
                url: string;
            }[];
            seriesInfo: {
                currentSeason: number;
                currentEpisode: number;
            };
        };
    }>;
    getMediaItemsByListId(mediaListId: string): Promise<({
        mediaDetails: {
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
        };
    } & {
        id: string;
        mediaListId: string;
        mediaDetailsId: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        createdAt: Date;
        updatedAt: Date;
    } & {
        trackingData: {
            currentStatus: import("@prisma/client").$Enums.StatusNameEnum;
            note: string;
            score: number;
        } & {
            sitesToView: {
                url: string;
            }[];
            seriesInfo: {
                currentSeason: number;
                currentEpisode: number;
            };
        };
    })[]>;
    createMediaItem(mediaId: number, mediaType: MediaItemDto['mediaType'], mediaListId: string, mediaDetailsId: string): Promise<{
        mediaDetails: {
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
        };
    } & {
        id: string;
        mediaListId: string;
        mediaDetailsId: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        createdAt: Date;
        updatedAt: Date;
    } & {
        trackingData: {
            currentStatus: import("@prisma/client").$Enums.StatusNameEnum;
            note: string;
            score: number;
        } & {
            sitesToView: {
                url: string;
            }[];
            seriesInfo: {
                currentSeason: number;
                currentEpisode: number;
            };
        };
    }>;
    deleteMediaItem(id: string): Promise<{
        id: string;
        mediaListId: string;
        mediaDetailsId: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        createdAt: Date;
        updatedAt: Date;
    } & {
        trackingData: {
            currentStatus: import("@prisma/client").$Enums.StatusNameEnum;
            note: string;
            score: number;
        } & {
            sitesToView: {
                url: string;
            }[];
            seriesInfo: {
                currentSeason: number;
                currentEpisode: number;
            };
        };
    }>;
    updateMediaItemTrackingData(id: string, trackingData: MediaItemDto['trackingData']): Promise<{
        mediaDetails: {
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
        };
    } & {
        id: string;
        mediaListId: string;
        mediaDetailsId: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        createdAt: Date;
        updatedAt: Date;
    } & {
        trackingData: {
            currentStatus: import("@prisma/client").$Enums.StatusNameEnum;
            note: string;
            score: number;
        } & {
            sitesToView: {
                url: string;
            }[];
            seriesInfo: {
                currentSeason: number;
                currentEpisode: number;
            };
        };
    }>;
    updateMediaItem(id: string, data: Partial<Pick<MediaItemDto, 'mediaDetailsId' | 'mediaListId'>>): Promise<{
        mediaDetails: {
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
        };
    } & {
        id: string;
        mediaListId: string;
        mediaDetailsId: string;
        mediaId: number;
        mediaType: import("@prisma/client").$Enums.MediaTypeEnum;
        createdAt: Date;
        updatedAt: Date;
    } & {
        trackingData: {
            currentStatus: import("@prisma/client").$Enums.StatusNameEnum;
            note: string;
            score: number;
        } & {
            sitesToView: {
                url: string;
            }[];
            seriesInfo: {
                currentSeason: number;
                currentEpisode: number;
            };
        };
    }>;
}
