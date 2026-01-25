import {
  CreateReleaseSubscriptionType,
  ReleaseSubscriptionsResponseType,
  ReleaseSubscriptionType,
  SortOrderEnum,
  UpdateReleaseSubscriptionType,
} from "@movie-tracker/types"

export const ReleaseSubscriptionRepositorySymbol = Symbol("ReleaseSubscriptionRepository")

export interface ReleaseSubscriptionRepositoryInterface {
  create: (args: CreateReleaseSubscriptionType) => Promise<ReleaseSubscriptionType>

  getById: (args: Pick<ReleaseSubscriptionType, "id">) => Promise<ReleaseSubscriptionType | undefined>

  getByMediaDetailsId: (
    args: Pick<ReleaseSubscriptionType, "mediaDetailsId">
  ) => Promise<ReleaseSubscriptionType[] | undefined>

  getByMediaIdUserId: (
    args: { mediaId: number, userId: string }
  ) => Promise<ReleaseSubscriptionType | undefined>

  getUncompletedByMediaDetailsId: (
    args: Pick<ReleaseSubscriptionType, "mediaDetailsId">
  ) => Promise<ReleaseSubscriptionType[] | undefined>

  getByUserId: (
    args: {
      userId: string
      limit: number
      offset: number
      search?: string
      sortBy?: "createdAt" | "lastReleasedAt"
      sortDirection?: SortOrderEnum
    }
  ) => Promise<ReleaseSubscriptionsResponseType>

  getAllByUserId: (
    args: {
      userId: string
    }
  ) => Promise<ReleaseSubscriptionType[]>

  update: (
    args: Pick<ReleaseSubscriptionType, "id"> & UpdateReleaseSubscriptionType
  ) => Promise<ReleaseSubscriptionType>

  updateManyByIds: (
    args: {
      ids: string[]
    } & UpdateReleaseSubscriptionType
  ) => Promise<ReleaseSubscriptionType[]>

  delete: (args: Pick<ReleaseSubscriptionType, "id">) => Promise<ReleaseSubscriptionType>
}
