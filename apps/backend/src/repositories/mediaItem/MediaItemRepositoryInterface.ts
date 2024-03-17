import {
  MediaItemStatusNameEnum,
  MediaItemTrackingDataType,
  MediaItemType,
} from '@movie-tracker/types';

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
    createdAt?: Date,
    currentStatus?: MediaItemStatusNameEnum,
  ) => Promise<MediaItemType>;

  createMediaItemWithExistedData: (
    mediaId: number,
    mediaType: string,
    mediaListId: string,
    mediaDetailsId: string,
    trackingData: Omit<
      MediaItemTrackingDataType,
      'id' | 'updatedAt' | 'createdAt' | 'mediaItemId'
    >,
    createdAt?: Date,
  ) => Promise<MediaItemType>;

  deleteMediaItem: (id: string) => Promise<MediaItemType>;

  updateMediaItem: (
    id: string,
    data: Partial<Pick<MediaItemType, 'mediaDetailsId' | 'mediaListId'>>,
  ) => Promise<MediaItemType>;

  getMediaItemsCount: () => Promise<number>;
}
