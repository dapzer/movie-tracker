import { MediaTypeEnum } from '@prisma/client';
export declare class CreateMediaItemDto {
    mediaType: MediaTypeEnum;
    mediaId: number;
    mediaListId: string;
}
