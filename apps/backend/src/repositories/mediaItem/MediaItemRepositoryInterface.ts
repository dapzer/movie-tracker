import { MediaItemTrackingDataType, MediaItemType } from '@movie-tracker/types';

export const MediaItemRepositorySymbol = Symbol();

export interface MediaItemRepositoryInterface {
  getAllMediaItems: () => Promise<MediaItemType[]>;

  getMediaItemById: (id: string) => Promise<MediaItemType>;

  getMediaItemsByListId: (mediaListId: string) => Promise<MediaItemType[]>;

  getMediaItemsByUserId: (userId: string) => Promise<MediaItemType[]>;

  createMediaItem: (
    mediaId: number,
    mediaType: string,
    mediaListId: string,
    mediaDetailsId: string,
  ) => Promise<MediaItemType>;

  deleteMediaItem: (id: string) => Promise<MediaItemType>;

  updateMediaItemTrackingData: (
    id: string,
    trackingData: MediaItemTrackingDataType,
  ) => Promise<MediaItemTrackingDataType>;

  updateMediaItem: (
    id: string,
    data: Partial<Pick<MediaItemType, 'mediaDetailsId' | 'mediaListId'>>,
  ) => Promise<MediaItemType>;
}
