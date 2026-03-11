import { ReleaseSubscriptionsResponseType, ReleaseSubscriptionType } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  ReleaseSubscriptionRepositoryInterface,
  ReleaseSubscriptionRepositorySymbol,
} from "@/repositories/releaseSubscription/ReleaseSubscriptionRepositoryInterface"
import { MediaDetailsService } from "@/services/mediaDetails/mediaDetails.service"
import { CreateReleaseSubscriptionDto } from "@/services/releaseSubscriptions/dto/createReleaseSubscription.dto"
import {
  GetReleaseSubscriptionsByUserIdQueryDto,
} from "@/services/releaseSubscriptions/dto/getReleaseSubscriptionsByUserIdQuery.dto"
import {
  ReleaseSubscriptionNotFoundError,
  ReleaseSubscriptionPermissionDeniedError,
} from "@/shared/errors/releaseSubscription"

@Injectable()
export class ReleaseSubscriptionsService {
  constructor(
    @Inject(ReleaseSubscriptionRepositorySymbol) private readonly releaseSubscriptionRepository: ReleaseSubscriptionRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
  ) {
  }

  async create(args: { userId: string } & CreateReleaseSubscriptionDto): Promise<ReleaseSubscriptionType> {
    const mediaDetails = await this.mediaDetailsService.createOrUpdate({
      mediaId: args.mediaId,
      mediaType: args.mediaType,
      skipError: false,
    })

    return this.releaseSubscriptionRepository.create({
      userId: args.userId,
      mediaDetailsId: mediaDetails.id,
      mediaId: args.mediaId,
      mediaType: args.mediaType,
    })
  }

  async getByMediaIdAndUserId(args: { mediaId: number, userId: string }): Promise<ReleaseSubscriptionType> {
    return this.releaseSubscriptionRepository.getByMediaIdUserId({ mediaId: args.mediaId, userId: args.userId })
  }

  async getByUserId(args: { userId: string } & GetReleaseSubscriptionsByUserIdQueryDto): Promise<ReleaseSubscriptionsResponseType> {
    return this.releaseSubscriptionRepository.getByUserId(args)
  }

  async delete(args: { id: string, userId: string }): Promise<ReleaseSubscriptionType> {
    const releaseSubscription = await this.releaseSubscriptionRepository.getById({ id: args.id })

    if (!releaseSubscription) {
      throw new ReleaseSubscriptionNotFoundError({ subscriptionId: args.id })
    }

    if (releaseSubscription.userId !== args.userId) {
      throw new ReleaseSubscriptionPermissionDeniedError({ userId: args.userId, subscriptionId: args.id })
    }

    return this.releaseSubscriptionRepository.delete({ id: args.id })
  }
}
