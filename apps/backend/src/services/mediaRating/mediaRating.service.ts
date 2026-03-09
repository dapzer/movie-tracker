import { MediaRatingPaginatedType, UserMediaRatingsAccessLevelEnum } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  MediaDetailsRepositoryInterface,
  MediaDetailsRepositorySymbol,
} from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import {
  MediaRatingRepositoryInterface,
  MediaRatingRepositorySymbol,
} from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { MediaDetailsService } from "@/services/mediaDetails/mediaDetails.service"
import { CreateMediaRatingDto } from "@/services/mediaRating/dto/createMediaRating.dto"
import { GetMediaRatingByMediaIdParamsDto } from "@/services/mediaRating/dto/getMediaRatingByMediaIdParamsDto"
import { UpdateMediaRatingDto } from "@/services/mediaRating/dto/updateMediaRating.dto"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { UserNotFoundError } from "@/shared/errors/auth"
import {
  MediaDetailsCreationFailedError,
  MediaRatingNotFoundError,
  MediaRatingPermissionDeniedError,
  MediaRatingUnauthorizedError,
} from "@/shared/errors/mediaRating"

@Injectable()
export class MediaRatingService {
  constructor(
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
    @Inject(MediaDetailsRepositorySymbol)
    private mediaDetailsRepository: MediaDetailsRepositoryInterface,
    @Inject(UserRepositorySymbol)
    private readonly userRepository: UserRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
  ) {}

  async getByMediaId(args: {
    userId: string
  } & GetMediaRatingByMediaIdParamsDto) {
    const mediaRating = await this.mediaRatingRepository.getByUserIdAndMediaId(args)

    if (!mediaRating) {
      throw new MediaRatingNotFoundError({ mediaId: args.mediaId })
    }

    if (mediaRating.userId !== args.userId) {
      throw new MediaRatingUnauthorizedError({ userId: args.userId, mediaRatingId: mediaRating.id })
    }

    return mediaRating
  }

  async getRecentlyCreated(args: PaginationDto): Promise<MediaRatingPaginatedType> {
    return this.mediaRatingRepository.getRecentlyCreated(args)
  }

  async getByUserId(args: {
    userId: string
    currentUserId?: string
  } & PaginationDto): Promise<MediaRatingPaginatedType> {
    const user = await this.userRepository.getById(args.userId)

    if (!user) {
      throw new UserNotFoundError({ userId: args.userId })
    }

    if (user.mediaRatingsAccessLevel !== UserMediaRatingsAccessLevelEnum.PUBLIC && args.currentUserId !== args.userId) {
      throw new MediaRatingPermissionDeniedError({ userId: args.currentUserId })
    }

    const mediaRatings = await this.mediaRatingRepository.getByUserId({
      userId: args.userId,
      limit: args.limit,
      offset: args.offset,
    })

    return {
      items: mediaRatings.items,
      totalCount: mediaRatings.totalCount,
    }
  }

  async create(args: {
    userId: string
    body: CreateMediaRatingDto
  }) {
    const mediaDetails = await this.mediaDetailsService.createOrUpdate(
      {
        mediaId: args.body.mediaId,
        mediaType: args.body.mediaType,
        skipError: false,
        currentDetails: null,
      },
    )

    if (!mediaDetails) {
      throw new MediaDetailsCreationFailedError({ mediaId: args.body.mediaId, mediaType: args.body.mediaType })
    }

    return this.mediaRatingRepository.create({
      userId: args.userId,
      mediaDetailsId: mediaDetails.id,
      ...args.body,
    })
  }

  async update(args: {
    id: string
    userId: string
    body: UpdateMediaRatingDto
  }) {
    const mediaRating = await this.mediaRatingRepository.getById({ id: args.id })

    if (!mediaRating) {
      throw new MediaRatingNotFoundError({ mediaRatingId: args.id })
    }

    if (mediaRating.userId !== args.userId) {
      throw new MediaRatingUnauthorizedError({ userId: args.userId, mediaRatingId: args.id })
    }

    return this.mediaRatingRepository.update({
      id: args.id,
      ...args.body,
    })
  }

  async delete(args: { id: string, userId: string }) {
    const mediaRating = await this.mediaRatingRepository.getById({ id: args.id })

    if (!mediaRating) {
      throw new MediaRatingNotFoundError({ mediaRatingId: args.id })
    }

    if (mediaRating.userId !== args.userId) {
      throw new MediaRatingUnauthorizedError({ userId: args.userId, mediaRatingId: args.id })
    }

    return this.mediaRatingRepository.delete(args.id)
  }
}
