import { MediaListType } from "@movie-tracker/types"

export const CommunityListsRepositorySymbol = Symbol("communityListsRepository")

export interface CommunityListsRepositoryInterface {
  getByTitle: (args: { title: string, currentUserId?: string }) => Promise<MediaListType | null>
  getWeakTop: (args: { limit: number, offset: number, fromDate: Date, currentUserId?: string }) => Promise<MediaListType[]>
  getAllTimeTop: (args: { limit: number, offset: number, currentUserId?: string }) => Promise<MediaListType[]>
  getNewest: (args: { limit: number, offset: number, currentUserId?: string }) => Promise<MediaListType[]>
}
