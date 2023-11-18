import { MediaListDto } from '@/routes/mediaList/dto/mediaList.dto';
export declare class UpdateMediaListDto implements Pick<MediaListDto, 'title' | 'isPublic' | 'poster'> {
    isPublic: boolean;
    poster: string;
    title: string;
}
