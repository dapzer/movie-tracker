import { MediaDetails, ReleaseSubscription } from "@movie-tracker/database"
import {
  MediaDetailsInfoType,
  MediaDetailsType,
  MediaTypeEnum,
  ReleaseSubscriptionsResponseType,
  ReleaseSubscriptionType,
  ReleaseSubscriptionWithDetailsType,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import {
  ReleaseSubscriptionRepositoryInterface,
} from "@/repositories/releaseSubscription/ReleaseSubscriptionRepositoryInterface"
import { PrismaService } from "@/services/prisma/prisma.service"

@Injectable()
export class PrismaReleaseSubscriptionRepository implements ReleaseSubscriptionRepositoryInterface {
  constructor(private readonly prisma: PrismaService) {}

  private convertMediaDetailsToInterface(data: MediaDetails): MediaDetailsType {
    return {
      id: data.id,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType],
      score: data.score.toNumber(),
      en: data.en as unknown as MediaDetailsInfoType,
      ru: data.ru as unknown as MediaDetailsInfoType,
      createdAt: data.createdAt,
      updatedAt: data.updatedAt,
    }
  }

  private convertToInterface(
    data: ReleaseSubscription & { mediaDetails?: MediaDetails },
  ): ReleaseSubscriptionType | ReleaseSubscriptionWithDetailsType {
    if (!data) {
      return undefined
    }

    const record: ReleaseSubscriptionType = {
      id: data.id,
      mediaDetailsId: data.mediaDetailsId,
      mediaId: data.mediaId,
      mediaType: MediaTypeEnum[data.mediaType.toUpperCase()],
      userId: data.userId,
      lastReleasedAt: data.lastReleasedAt,
      completedAt: data.completedAt,
      createdAt: data.createdAt,
    }

    if (data.mediaDetails) {
      return {
        ...record,
        mediaDetails: this.convertMediaDetailsToInterface(data.mediaDetails),
      }
    }

    return record
  }

  async createReleaseSubscription(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["createReleaseSubscription"]>[0],
  ) {
    const releaseSubscription = await this.prisma.releaseSubscription.create({
      data: {
        userId: args.userId,
        mediaId: args.mediaId,
        mediaType: args.mediaType,
        mediaDetailsId: args.mediaDetailsId,
      },
    })

    return this.convertToInterface(releaseSubscription)
  }

  async getById(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getById"]>[0],
  ) {
    const releaseSubscription = await this.prisma.releaseSubscription.findUnique({
      where: { id: args.id },
    })

    return this.convertToInterface(releaseSubscription)
  }

  async getByMediaDetailsId(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getByMediaDetailsId"]>[0],
  ) {
    const releaseSubscriptions = await this.prisma.releaseSubscription.findMany({
      where: { mediaDetailsId: args.mediaDetailsId },
    })

    return releaseSubscriptions.map(this.convertToInterface)
  }

  async getUncompletedByMediaDetailsId(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getUncompletedByMediaDetailsId"]>[0],
  ) {
    const releaseSubscriptions = await this.prisma.releaseSubscription.findMany({
      where: {
        mediaDetailsId: args.mediaDetailsId,
        completedAt: null,
      },
    })

    return releaseSubscriptions.map(this.convertToInterface)
  }

  async getByUserId(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getByUserId"]>[0],
  ): Promise<ReleaseSubscriptionsResponseType> {
    const [items, totalCount] = await Promise.all([
      this.prisma.releaseSubscription.findMany({
        where: {
          userId: args.userId,
        },
        include: {
          mediaDetails: true,
        },
        orderBy: {
          createdAt: "desc",
        },
        take: args.limit,
        skip: args.offset,
      }),
      this.prisma.releaseSubscription.count({
        where: {
          userId: args.userId,
        },
      }),
    ])

    return {
      items: items.map(
        item => this.convertToInterface(item) as ReleaseSubscriptionWithDetailsType,
      ),
      totalCount,
    }
  }

  async getAllByUserId(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["getAllByUserId"]>[0],
  ) {
    const releaseSubscriptions = await this.prisma.releaseSubscription.findMany({
      where: { userId: args.userId },
    })

    return releaseSubscriptions.map(this.convertToInterface)
  }

  async update(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["update"]>[0],
  ) {
    const releaseSubscription = await this.prisma.releaseSubscription.update({
      where: { id: args.id },
      data: {
        completedAt: args.completedAt,
        lastReleasedAt: args.lastReleasedAt,
      },
    })

    return this.convertToInterface(releaseSubscription)
  }

  async updateManyByIds(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["updateManyByIds"]>[0],
  ) {
    const releaseSubscriptions = await this.prisma.releaseSubscription.updateManyAndReturn({
      where: { id: { in: args.ids } },
      data: {
        completedAt: args.completedAt,
        lastReleasedAt: args.lastReleasedAt,
      },
    })

    return releaseSubscriptions.map(this.convertToInterface)
  }

  async delete(
    args: Parameters<ReleaseSubscriptionRepositoryInterface["delete"]>[0],
  ) {
    const releaseSubscription = await this.prisma.releaseSubscription.delete({
      where: { id: args.id },
    })

    return this.convertToInterface(releaseSubscription)
  }
}
