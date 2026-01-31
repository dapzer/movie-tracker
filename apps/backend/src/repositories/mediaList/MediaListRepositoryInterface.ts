import {
  MediaListCreateBodyType,
  MediaListLikeType,
  MediaListType,
  MediaListUpdateBodyType,
} from "@movie-tracker/types"

export const MediaListRepositorySymbol = Symbol("MediaListRepository")

export interface MediaListRepositoryInterface {
  getById: (args: {
    id: string
    currentUserId?: string
  }) => Promise<MediaListType>

  getByMediaItemAndUserId: (args: {
    mediaItemId: string
    userId: string
    currentUserId?: string
  }) => Promise<MediaListType>

  getByHumanFriendlyId: (args: {
    id: string
    currentUserId?: string
  }) => Promise<MediaListType>

  getByUserId: (args: {
    userId: string
    currentUserId?: string
    isPublicOnly?: boolean
  }) => Promise<MediaListType[]>

  create: (args: {
    userId: string
    isSystem?: boolean
    body?: MediaListCreateBodyType
  }) => Promise<MediaListType>

  delete: (id: string) => Promise<MediaListType>

  update: (args: {
    id: string
    body: MediaListUpdateBodyType
  }) => Promise<MediaListType>

  getCount: () => Promise<number>

  getCountByUserId: (userId: string) => Promise<number>

  createLike: (args: {
    mediaListId: string
    userId: string
  }) => Promise<MediaListLikeType>

  deleteLike: (args: {
    mediaListId: string
    userId: string
  }) => Promise<MediaListLikeType>
}
