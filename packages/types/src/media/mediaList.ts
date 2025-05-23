export interface MediaListType {
  id: string
  humanFriendlyId: string
  userId: string
  title?: string
  description?: string
  poster?: MediaListPosterType
  likesCount?: number
  mediaItemsCount?: number
  isLiked?: boolean
  isSystem: boolean
  isPublic: boolean
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

export interface MediaListPosterType {
  en: Array<string | undefined>
  ru: Array<string | undefined>
}

export type MediaListCreateBodyType = Pick<MediaListType, "title" | "description" | "isPublic">

export type MediaListUpdateBodyType = Pick<MediaListType, "title" | "description" | "isPublic">

export const MEDIA_LIST_COUNT_LIMIT = 12
