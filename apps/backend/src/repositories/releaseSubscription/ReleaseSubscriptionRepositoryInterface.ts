import {
  CreateReleaseSubscriptionType,
  ReleaseSubscriptionsResponseType,
  ReleaseSubscriptionType,
  UpdateReleaseSubscriptionType,
} from "@movie-tracker/types"

export const ReleaseSubscriptionRepositorySymbol = Symbol("ReleaseSubscriptionRepository")

export interface ReleaseSubscriptionRepositoryInterface {
  createReleaseSubscription: (args: CreateReleaseSubscriptionType) => Promise<ReleaseSubscriptionType>

  getById: (args: Pick<ReleaseSubscriptionType, "id">) => Promise<ReleaseSubscriptionType | undefined>

  getByMediaDetailsId: (
    args: Pick<ReleaseSubscriptionType, "mediaDetailsId">
  ) => Promise<ReleaseSubscriptionType[] | undefined>

  getUncompletedByMediaDetailsId: (
    args: Pick<ReleaseSubscriptionType, "mediaDetailsId">
  ) => Promise<ReleaseSubscriptionType[] | undefined>

  getByUserId: (
    args: {
      userId: string
      limit: number
      offset: number
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
