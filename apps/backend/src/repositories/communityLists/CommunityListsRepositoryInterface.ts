import { MediaListsPaginatedType } from "@movie-tracker/types"

export const CommunityListsRepositorySymbol = Symbol("communityListsRepository")

export interface CommunityListsRepositoryInterface {
  getByTitle: (args: { title: string, currentUserId?: string, limit: number, offset: number }) => Promise<MediaListsPaginatedType>
  getWeakTop: (args: { limit: number, offset: number, fromDate: Date, currentUserId?: string }) => Promise<MediaListsPaginatedType>
  getAllTimeTop: (args: { limit: number, offset: number, currentUserId?: string }) => Promise<MediaListsPaginatedType>
  getNewest: (args: { limit: number, offset: number, currentUserId?: string }) => Promise<MediaListsPaginatedType>
  getListsWithMedia: (args: { mediaId: number, currentUserId?: string, limit: number, offset: number }) => Promise<MediaListsPaginatedType>
}
