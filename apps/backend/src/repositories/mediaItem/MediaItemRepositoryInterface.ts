import { MediaItemDto } from '@/routes/mediaItem/dto/mediaItem.dto';

export const MediaItemRepositorySymbol = Symbol();

export interface MediaItemRepositoryInterface {
  getAllMediaItems: () => Promise<MediaItemDto[]>;

  getMediaItemById: (id: string) => Promise<MediaItemDto>;

  getMediaItemsByListId: (mediaListId: string) => Promise<MediaItemDto[]>;

  createMediaItem: (
    mediaId: number,
    mediaType: string,
    mediaListId: string,
    mediaDetailsId: string,
  ) => Promise<MediaItemDto>;

  deleteMediaItem: (id: string) => Promise<MediaItemDto>;

  updateMediaItemTrackingData: (
    id: string,
    trackingData: MediaItemDto['trackingData'],
  ) => Promise<MediaItemDto>;

  updateMediaItem: (
    id: string,
    data: Partial<Pick<MediaItemDto, 'mediaDetailsId' | 'mediaListId'>>,
  ) => Promise<MediaItemDto>;
}
