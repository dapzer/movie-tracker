import {
  MediaRatingRepositoryInterface,
  MediaRatingRepositorySymbol,
} from "@/repositories/mediaRating/MediaRatingRepositoryInterface"
import { CreateMediaRatingDto } from "@/routes/mediaRating/dto/createMediaRating.dto"
import { GetMediaRatingByUserIdQueryDto } from "@/routes/mediaRating/dto/getMediaRatingByUserIdQuery.dto"
import { UpdateMediaRatingDto } from "@/routes/mediaRating/dto/updateMediaRating.dto"
import { HttpException, HttpStatus, Inject, Injectable } from "@nestjs/common"

@Injectable()
export class MediaRatingService {
  constructor(
    @Inject(MediaRatingRepositorySymbol)
    private readonly mediaRatingRepository: MediaRatingRepositoryInterface,
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
