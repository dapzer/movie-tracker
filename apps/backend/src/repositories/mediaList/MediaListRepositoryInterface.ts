import { MediaListType } from '@movie-tracker/types';

export const MediaListRepositorySymbol = Symbol();

export interface MediaListRepositoryInterface {
  getAllMedialLists: (isPublicOnly?: boolean) => Promise<MediaListType[]>;

  getMedialListById: (id: string) => Promise<MediaListType>;

  getMedialListByHumanFriendlyId: (id: string) => Promise<MediaListType>;

  getMedialListsByUserId: (
    userId: string,
    isPublicOnly?: boolean,
  ) => Promise<MediaListType[]>;

  createMediaList: (
    userId: string,
    isSystem?: boolean,
    body?: Pick<MediaListType, 'title' | 'poster' | 'isPublic'>,
  ) => Promise<MediaListType>;

  deleteMediaList: (id: string) => Promise<MediaListType>;

  updateMediaList: (
    id: string,
    body: Pick<MediaListType, 'title' | 'poster' | 'isPublic'>,
  ) => Promise<MediaListType>;

  getMediaListsCount: () => Promise<number>;
}
