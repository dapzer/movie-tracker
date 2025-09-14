import { MediaRatingType } from "@movie-tracker/types"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import {
  MediaDetailsRepositoryInterface,
  MediaDetailsRepositorySymbol,
} from "@/repositories/mediaDetails/MediaDetailsRepositoryInterface"
import {
  MediaRatingRepositoryInterface,
  MediaRatingRepositorySymbol,
} from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"
import { CreateMediaRatingDto } from "@/routes/mediaRating/dto/createMediaRating.dto"
import { GetMediaRatingByMediaIdParamsDto } from "@/routes/mediaRating/dto/getMediaRatingByMediaIdParamsDto"
import { UpdateMediaRatingDto } from "@/routes/mediaRating/dto/updateMediaRating.dto"

@Injectable()
export class MediaRatingService {
  constructor(
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
    @Inject(MediaDetailsRepositorySymbol)
    private mediaDetailsRepository: MediaDetailsRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
  ) {}

  async getMediaRatingByUserId(args: {
    userId: string
  } & GetMediaRatingByMediaIdParamsDto) {
    const mediaRating = await this.mediaRatingRepository.getMediaRatingByUserIdAndMediaId(args)

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

  async getMediaRatingsByUserId(args: {
    userId: string
  }): Promise<MediaRatingType[]> {
    const mediaRatings = await this.mediaRatingRepository.getMediaRatingsByUserId({
      userId: args.userId,
    })
    const mediaIds = mediaRatings.map(el => el.mediaId)
    const mediaDetails = await this.mediaDetailsRepository.getMediaDetailsByMediaIds({
      mediaIds,
    })

    return mediaRatings.map(el => ({
      ...el,
      mediaDetails: mediaDetails.find(deteils => deteils.mediaId === el.mediaId) || undefined,
    }))
  }

  async createMediaRating(args: {
    userId: string
    body: CreateMediaRatingDto
  }) {
    await this.mediaDetailsService.createOrUpdateMediaDetails(
      args.body.mediaId,
      args.body.mediaType,
      null,
    )

    return this.mediaRatingRepository.createMediaRating({
      userId: args.userId,
      ...args.body,
    })
  }

  async updateMediaRating(args: {
    id: string
    userId: string
    body: UpdateMediaRatingDto
  }) {
    const mediaRating = await this.mediaRatingRepository.getMediaRatingById({ id: args.id })

    if (!mediaRating) {
      throw new HttpException(
        `Media rating with id '${args.id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaRating.userId !== args.userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaRatingRepository.updateMediaRating({
      id: args.id,
      ...args.body,
    })
  }

  async deleteMediaRating(args: { id: string, userId: string }) {
    const mediaRating = await this.mediaRatingRepository.getMediaRatingById({ id: args.id })

    if (!mediaRating) {
      throw new HttpException(
        `Media rating with id '${args.id}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaRating.userId !== args.userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaRatingRepository.deleteMediaRating(args.id)
  }
}
