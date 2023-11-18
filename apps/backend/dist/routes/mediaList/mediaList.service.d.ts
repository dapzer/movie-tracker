import { UpdateMediaListDto } from '@/routes/mediaList/dto/updateMediaList.dto';
import { MediaListRepositoryInterface } from '@/repositories/mediaList/MediaListRepositoryInterface';
import { MediaListDto } from '@/routes/mediaList/dto/mediaList.dto';
export declare class MediaListService {
    private readonly mediaListRepository;
    constructor(mediaListRepository: MediaListRepositoryInterface);
    private isListOwner;
    getAllMedialLists(isPublicOnly?: boolean): Promise<MediaListDto[]>;
    getMedialListById(id: string, userId: string): Promise<MediaListDto>;
    getMedialListByUserId(userId: string, currentUserId: string): Promise<MediaListDto[]>;
    createMediaList(userId: string): Promise<MediaListDto>;
    updateMediaList(id: string, body: UpdateMediaListDto, userId: string): Promise<MediaListDto>;
    deleteMediaList(id: string, userId: string): Promise<MediaListDto>;
}
