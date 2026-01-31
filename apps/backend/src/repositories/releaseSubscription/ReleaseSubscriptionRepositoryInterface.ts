import {
  CreateReleaseSubscriptionType,
  MediaTypeEnum,
  ReleaseSubscriptionsResponseType,
  ReleaseSubscriptionType,
  SortOrderEnum,
  UpdateReleaseSubscriptionType,
} from "@movie-tracker/types"

export const ReleaseSubscriptionRepositorySymbol = Symbol("ReleaseSubscriptionRepository")

export interface ReleaseSubscriptionRepositoryInterface {
  create: (args: CreateReleaseSubscriptionType) => Promise<ReleaseSubscriptionType>

  getById: (args: {
    id: string
  }) => Promise<ReleaseSubscriptionType | undefined>

  getByMediaDetailsId: (args: {
    mediaDetailsId: string
  }) => Promise<ReleaseSubscriptionType[] | undefined>

  getByMediaIdUserId: (args: {
    mediaId: number
    userId: string
  }) => Promise<ReleaseSubscriptionType | undefined>

  getUncompletedByMediaDetailsId: (args: {
    mediaDetailsId: string
  }) => Promise<ReleaseSubscriptionType[] | undefined>

  getByUserId: (args: {
    userId: string
    limit: number
    offset: number
    search?: string
    completed?: boolean
    mediaType?: MediaTypeEnum
    sortBy?: "createdAt" | "lastReleasedAt"
    sortDirection?: SortOrderEnum
  }) => Promise<ReleaseSubscriptionsResponseType>

  getAllByUserId: (args: {
    userId: string
  }) => Promise<ReleaseSubscriptionType[]>

  getAll: () => Promise<ReleaseSubscriptionType[]>

  update: (args: {
    id: string
  } & UpdateReleaseSubscriptionType) => Promise<ReleaseSubscriptionType>

  updateManyByIds: (args: {
    ids: string[]
  } & UpdateReleaseSubscriptionType) => Promise<ReleaseSubscriptionType[]>

  delete: (args: {
    id: string
  }) => Promise<ReleaseSubscriptionType>
}
