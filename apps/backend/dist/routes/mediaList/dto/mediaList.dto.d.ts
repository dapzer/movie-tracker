import { MediaList } from '@prisma/client';
export declare class MediaListDto implements MediaList {
    id: string;
    userId: string;
    isSystem: boolean;
    isPublic: boolean;
    title: string;
    poster: string;
    createdAt: Date;
    updatedAt: Date;
}
