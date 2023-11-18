import { PrismaService } from '@/services/prisma/prisma.service';
import { MediaListRepositoryInterface } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { MediaListDto } from '@/routes/mediaList/dto/mediaList.dto';
export declare class PrismaMediaListRepository implements MediaListRepositoryInterface {
    private readonly prisma;
    constructor(prisma: PrismaService);
    getAllMedialLists(isPublicOnly?: boolean): Promise<{
        id: string;
        userId: string;
        title: string;
        poster: string;
        isSystem: boolean;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    getMedialListById(id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        poster: string;
        isSystem: boolean;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    getMedialListsByUserId(userId: string, isPublicOnly?: boolean): Promise<{
        id: string;
        userId: string;
        title: string;
        poster: string;
        isSystem: boolean;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }[]>;
    createMediaList(userId: string, isSystem?: boolean): Promise<{
        id: string;
        userId: string;
        title: string;
        poster: string;
        isSystem: boolean;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    deleteMediaList(id: string): Promise<{
        id: string;
        userId: string;
        title: string;
        poster: string;
        isSystem: boolean;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
    updateMediaList(id: string, body: Pick<MediaListDto, 'title' | 'poster' | 'isPublic'>): Promise<{
        id: string;
        userId: string;
        title: string;
        poster: string;
        isSystem: boolean;
        isPublic: boolean;
        createdAt: Date;
        updatedAt: Date;
    }>;
}
