import { ReleaseSubscriptionsResponseType, ReleaseSubscriptionType } from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import {
  ReleaseSubscriptionRepositoryInterface,
  ReleaseSubscriptionRepositorySymbol,
} from "@/repositories/releaseSubscription/ReleaseSubscriptionRepositoryInterface"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"
import { CreateReleaseSubscriptionDto } from "@/routes/releaseSubscription/dto/createReleaseSubscription.dto"
import {
  GetReleaseSubscriptionsByUserIdQueryDto,
} from "@/routes/releaseSubscription/dto/getReleaseSubscriptionsByUserIdQuery.dto"

@Injectable()
export class ReleaseSubscriptionService {
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
      throw new HttpException("Release subscription not found", HttpStatus.NOT_FOUND)
    }

    if (releaseSubscription.userId !== args.userId) {
      throw new HttpException("Permission denied", HttpStatus.FORBIDDEN)
    }

    return this.releaseSubscriptionRepository.delete({ id: args.id })
  }
}
