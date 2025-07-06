import { UserType } from "../user"

export interface MediaListType {
  id: string
  humanFriendlyId: string
  userId: string
  user?: Pick<UserType, "image" | "name" | "id">
  title?: string
  description?: string
  poster?: MediaListPosterType
  likesCount?: number
  mediaItemsCount?: number
  isLiked?: boolean
  isSystem: boolean
  accessLevel: MediaListAccessLevelEnum
  createdAt: Date
  updatedAt: Date
}

export interface MediaListLikeType {
  id: string
  mediaListId: string
  mediaListHumanFriendlyId?: string
  userId: string
  createdAt: Date
}

export interface MediaListViewType {
  id: string
  mediaListId: string
  userId: string
  createdAt: Date
  updatedAt: Date
}

export interface MediaListPosterType {
  en: Array<string | undefined>
  ru: Array<string | undefined>
}

export type MediaListCreateBodyType = Pick<MediaListType, "title" | "description" | "accessLevel">

export type MediaListUpdateBodyType = Pick<MediaListType, "title" | "description" | "accessLevel">

export interface MediaListsPaginatedType {
  items: MediaListType[]
  totalCount: number
}

export const MEDIA_LIST_COUNT_LIMIT = 12
export const MEDIA_LIST_TITLE_MIN_LENGTH_LIMIT = 3
export const MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT = 64

export enum MediaListAccessLevelEnum {
  PUBLIC = "PUBLIC",
  PRIVATE = "PRIVATE",
  URL = "URL",
}
