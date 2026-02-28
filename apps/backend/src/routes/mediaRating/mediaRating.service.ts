import { MediaRatingPaginatedType, UserMediaRatingsAccessLevelEnum } from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import {
  MediaDetailsRepositoryInterface,
  MediaDetailsRepositorySymbol,
} from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import {
  MediaRatingRepositoryInterface,
  MediaRatingRepositorySymbol,
} from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { UserRepositoryInterface, UserRepositorySymbol } from "@/repositories/user/UserRepositoryInterface"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"
import { CreateMediaRatingDto } from "@/routes/mediaRating/dto/createMediaRating.dto"
import { GetMediaRatingByMediaIdParamsDto } from "@/routes/mediaRating/dto/getMediaRatingByMediaIdParamsDto"
import { UpdateMediaRatingDto } from "@/routes/mediaRating/dto/updateMediaRating.dto"
import { PaginationDto } from "@/shared/dto/pagination.dto"

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
      throw new HttpException(
        `Media rating with mediaId '${args.mediaId}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaRating.userId !== args.userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
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
      throw new HttpException("User not found", HttpStatus.NOT_FOUND)
    }

    if (user.mediaRatingsAccessLevel !== UserMediaRatingsAccessLevelEnum.PUBLIC && args.currentUserId !== args.userId) {
      throw new HttpException("Permission denied", HttpStatus.FORBIDDEN)
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
      throw new HttpException(
        `Media details with mediaId '${args.body.mediaId}' and mediaType '${args.body.mediaType}' doesn't exist and couldn't be created.`,
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
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
      throw new HttpException(
        `Media rating with id '${args.id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaRating.userId !== args.userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaRatingRepository.update({
      id: args.id,
      ...args.body,
    })
  }

  async delete(args: { id: string, userId: string }) {
    const mediaRating = await this.mediaRatingRepository.getById({ id: args.id })

    if (!mediaRating) {
      throw new HttpException(
        `Media rating with id '${args.id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaRating.userId !== args.userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaRatingRepository.delete(args.id)
  }
}
