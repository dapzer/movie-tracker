import {
  MediaListCreateBodyType,
  MediaListLikeType,
  MediaListType,
  MediaListUpdateBodyType
} from '@movie-tracker/types';

export const MediaListRepositorySymbol = Symbol();

export interface MediaListRepositoryInterface {
  getAllMedialLists: (
    isPublicOnly?: boolean,
    userId?: string,
  ) => Promise<MediaListType[]>;

  getMedialListById: (id: string, userId?: string) => Promise<MediaListType>;

  getMedialListByMediaItemAndUserId: (
    mediaItemId: string,
    userId: string,
  ) => Promise<MediaListType>;

  getMedialListByHumanFriendlyId: (
    id: string,
    userId?: string,
  ) => Promise<MediaListType>;

  getMedialListsByUserId: (
    userId: string,
    isPublicOnly?: boolean,
  ) => Promise<MediaListType[]>;

  createMediaList: (
    userId: string,
    isSystem?: boolean,
    body?: MediaListCreateBodyType,
  ) => Promise<MediaListType>;

  deleteMediaList: (id: string) => Promise<MediaListType>;

  updateMediaList: (
    id: string,
    body: MediaListUpdateBodyType,
  ) => Promise<MediaListType>;

  getMediaListsCount: () => Promise<number>;

  createMediaListLike: (
    mediaListId: string,
    userId: string,
  ) => Promise<MediaListLikeType>;

  deleteMediaListLike: (
    mediaListId: string,
    userId: string,
  ) => Promise<MediaListLikeType>;
}
