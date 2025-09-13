import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"
import {
  MediaRatingRepositoryInterface,
  MediaRatingRepositorySymbol,
} from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { MediaDetailsService } from "@/routes/mediaDetails/mediaDetails.service"
import { CreateMediaRatingDto } from "@/routes/mediaRating/dto/createMediaRating.dto"
import { GetMediaRatingByUserIdQueryDto } from "@/routes/mediaRating/dto/getMediaRatingByUserIdQuery.dto"
import { UpdateMediaRatingDto } from "@/routes/mediaRating/dto/updateMediaRating.dto"

@Injectable()
export class MediaRatingService {
  constructor(
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
  ) {}

  async getMediaRatingByUserId(args: {
    userId: string
  } & GetMediaRatingByUserIdQueryDto) {
    const mediaRating = await this.mediaRatingRepository.getMediaRatingByUserId(args)

    if (!mediaRating) {
      throw new HttpException(
        `Media rating with mediaId '${args.mediaId}' and mediaType '${args.mediaType}' doesn't exist.`,
        HttpStatus.NOT_FOUND,
      )
    }

    if (mediaRating.userId !== args.userId) {
      throw new HttpException("Unauthorized.", HttpStatus.UNAUTHORIZED)
    }

    return mediaRating
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
    const mediaRating = await this.mediaRatingRepository.getMediaRatingId({ id: args.id })

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
    const mediaRating = await this.mediaRatingRepository.getMediaRatingId({ id: args.id })
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
