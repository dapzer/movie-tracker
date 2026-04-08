import { MediaReviewStatus, UserRoleEnum, UserType } from "@movie-tracker/types"
import { Inject, Injectable } from "@nestjs/common"
import {
  MediaReviewRepositoryInterface,
  MediaReviewRepositorySymbol,
} from "@/repositories/mediaReview/MediaReviewRepositoryInterface"
import {
  MediaReviewDislikeRepositoryInterface,
  MediaReviewDislikeRepositorySymbol,
} from "@/repositories/mediaReviewDislike/MediaReviewDislikeRepositoryInterface"
import {
  MediaReviewLikeRepositoryInterface,
  MediaReviewLikeRepositorySymbol,
} from "@/repositories/mediaReviewLike/MediaReviewLikeRepositoryInterface"
import { MediaDetailsService } from "@/services/mediaDetails/mediaDetails.service"
import { CreateMediaReviewDto } from "@/services/mediaReviews/dto/createMediaReview.dto"
import { CreateMediaReviewDislikeDto } from "@/services/mediaReviews/dto/createMediaReviewDislike.dto"
import { CreateMediaReviewLikeDto } from "@/services/mediaReviews/dto/createMediaReviewLike.dto"
import { UpdateMediaReviewDto } from "@/services/mediaReviews/dto/updateMediaReview.dto"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { MediaDetailsCreationFailedError } from "@/shared/errors/mediaRating"
import {
  MediaReviewAlreadyExistsError,
  MediaReviewDislikeAlreadyExistsError,
  MediaReviewDislikeNotFoundError,
  MediaReviewLikeAlreadyExistsError,
  MediaReviewLikeNotFoundError,
  MediaReviewNotFoundError,
  MediaReviewPermissionError,
  MediaReviewUnauthorizedError,
} from "@/shared/errors/mediaReview"

@Injectable()
export class MediaReviewsService {
  constructor(
    @Inject(MediaReviewRepositorySymbol)
    private readonly mediaReviewRepository: MediaReviewRepositoryInterface,
    @Inject(MediaReviewLikeRepositorySymbol)
    private readonly mediaReviewLikeRepository: MediaReviewLikeRepositoryInterface,
    @Inject(MediaReviewDislikeRepositorySymbol)
    private readonly mediaReviewDislikeRepository: MediaReviewDislikeRepositoryInterface,
    private readonly mediaDetailsService: MediaDetailsService,
  ) {
  }

  async getById(args: { id: string, currentUserId?: string }) {
    const mediaReview = await this.mediaReviewRepository.getById({ id: args.id, currentUserId: args.currentUserId })

    if (!mediaReview) {
      throw new MediaReviewNotFoundError({ mediaReviewId: args.id })
    }

    return mediaReview
  }

  async getByCurrentUserAndMediaId(args: { mediaId: number, currentUserId: string }) {
    return this.mediaReviewRepository.getByUserIdAndMediaId({
      userId: args.currentUserId,
      mediaId: args.mediaId,
      currentUserId: args.currentUserId,
    })
  }

  async getByMediaId(args: { mediaId: number, currentUser?: UserType, status?: MediaReviewStatus } & PaginationDto) {
    if (args.status !== MediaReviewStatus.PUBLISHED && !args.currentUser?.roles.includes(UserRoleEnum.ADMIN)) {
      throw new MediaReviewPermissionError({ userId: args.currentUser?.id, requiredRoles: [UserRoleEnum.ADMIN] })
    }

    return this.mediaReviewRepository.getByMediaId({
      mediaId: args.mediaId,
      limit: args.limit,
      offset: args.offset,
      currentUserId: args.currentUser?.id,
      status: args.status,
    })
  }

  async getByUserId(args: { userId: string, currentUser?: UserType, status?: MediaReviewStatus } & PaginationDto) {
    if (
      args.status !== MediaReviewStatus.PUBLISHED
      && (!args.currentUser?.roles.includes(UserRoleEnum.ADMIN) || args.currentUser.id !== args.userId)
    ) {
      throw new MediaReviewPermissionError({ userId: args.currentUser?.id, requiredRoles: [UserRoleEnum.ADMIN] })
    }

    return this.mediaReviewRepository.getByUserId({
      userId: args.userId,
      currentUserId: args.currentUser?.id,
      limit: args.limit,
      offset: args.offset,
      status: args.status,
    })
  }

  async getList(args: { currentUser?: UserType, status?: MediaReviewStatus } & PaginationDto) {
    if (args.status !== MediaReviewStatus.PUBLISHED && !args.currentUser?.roles.includes(UserRoleEnum.ADMIN)) {
      throw new MediaReviewPermissionError({ userId: args.currentUser?.id, requiredRoles: [UserRoleEnum.ADMIN] })
    }

    return this.mediaReviewRepository.getList({
      currentUserId: args.currentUser?.id,
      limit: args.limit,
      offset: args.offset,
      status: args.status,
    })
  }

  async create(args: { userId: string, body: CreateMediaReviewDto }) {
    const existing = await this.mediaReviewRepository.getByUserIdAndMediaId({
      userId: args.userId,
      mediaId: args.body.mediaId,
    })

    if (existing) {
      throw new MediaReviewAlreadyExistsError({ userId: args.userId, mediaId: args.body.mediaId })
    }

    const mediaDetails = await this.mediaDetailsService.createOrUpdate({
      mediaId: args.body.mediaId,
      mediaType: args.body.mediaType,
      skipError: false,
      currentDetails: null,
    })

    if (!mediaDetails) {
      throw new MediaDetailsCreationFailedError({ mediaId: args.body.mediaId, mediaType: args.body.mediaType })
    }

    return this.mediaReviewRepository.create({
      userId: args.userId,
      mediaDetailsId: mediaDetails.id,
      ...args.body,
    })
  }

  async update(args: { id: string, body: UpdateMediaReviewDto, currentUser?: UserType }) {
    const mediaReview = await this.mediaReviewRepository.getById({ id: args.id })

    if (!mediaReview) {
      throw new MediaReviewNotFoundError({ mediaReviewId: args.id })
    }

    const isModerator = args.currentUser?.roles.includes(UserRoleEnum.ADMIN)

    if (mediaReview.userId !== args.currentUser.id && !isModerator) {
      throw new MediaReviewUnauthorizedError({ userId: args.currentUser.id, mediaReviewId: args.id })
    }

    if (args.body.status && ![MediaReviewStatus.PENDING, MediaReviewStatus.DRAFT].includes(args.body.status) && !isModerator) {
      throw new MediaReviewPermissionError({ userId: args.currentUser.id })
    }

    return this.mediaReviewRepository.update({
      id: args.id,
      isSpoiler: args.body.isSpoiler,
      status: args.body.status,
      publishedAt: args.body.publishedAt,
      removeReason: args.body.removeReason,
      removedAt: args.body.removedAt,
    })
  }

  async delete(args: { id: string, userId: string }) {
    const mediaReview = await this.mediaReviewRepository.getById({ id: args.id })

    if (!mediaReview) {
      throw new MediaReviewNotFoundError({ mediaReviewId: args.id })
    }

    if (mediaReview.userId !== args.userId) {
      throw new MediaReviewUnauthorizedError({ userId: args.userId, mediaReviewId: args.id })
    }

    return this.mediaReviewRepository.delete(args.id)
  }

  async getLikesByReviewId(args: { mediaReviewId: string }) {
    return this.mediaReviewLikeRepository.getByReviewId({ mediaReviewId: args.mediaReviewId })
  }

  async createLike(args: { userId: string, body: CreateMediaReviewLikeDto }) {
    const mediaReview = await this.mediaReviewRepository.getById({ id: args.body.mediaReviewId })

    if (!mediaReview) {
      throw new MediaReviewNotFoundError({ mediaReviewId: args.body.mediaReviewId })
    }

    const existing = await this.mediaReviewLikeRepository.getByUserIdAndReviewId({
      userId: args.userId,
      mediaReviewId: args.body.mediaReviewId,
    })

    if (existing) {
      throw new MediaReviewLikeAlreadyExistsError({ userId: args.userId, mediaReviewId: args.body.mediaReviewId })
    }

    const dislike = await this.mediaReviewDislikeRepository.getByUserIdAndReviewId({
      userId: args.userId,
      mediaReviewId: args.body.mediaReviewId,
    })
    if (dislike) {
      await this.mediaReviewDislikeRepository.delete(dislike.id)
    }

    return this.mediaReviewLikeRepository.create({
      userId: args.userId,
      mediaDetailsId: mediaReview.mediaDetailsId,
      ...args.body,
    })
  }

  async deleteLike(args: { id: string, userId: string }) {
    const like = await this.mediaReviewLikeRepository.getById({ id: args.id })

    if (!like) {
      throw new MediaReviewLikeNotFoundError({ mediaReviewLikeId: args.id })
    }

    if (like.userId !== args.userId) {
      throw new MediaReviewUnauthorizedError({ userId: args.userId })
    }

    return this.mediaReviewLikeRepository.delete(args.id)
  }

  async getDislikesByReviewId(args: { mediaReviewId: string }) {
    return this.mediaReviewDislikeRepository.getByReviewId({ mediaReviewId: args.mediaReviewId })
  }

  async createDislike(args: { userId: string, body: CreateMediaReviewDislikeDto }) {
    const mediaReview = await this.mediaReviewRepository.getById({ id: args.body.mediaReviewId })

    if (!mediaReview) {
      throw new MediaReviewNotFoundError({ mediaReviewId: args.body.mediaReviewId })
    }

    const existing = await this.mediaReviewDislikeRepository.getByUserIdAndReviewId({
      userId: args.userId,
      mediaReviewId: args.body.mediaReviewId,
    })

    if (existing) {
      throw new MediaReviewDislikeAlreadyExistsError({ userId: args.userId, mediaReviewId: args.body.mediaReviewId })
    }

    const like = await this.mediaReviewLikeRepository.getByUserIdAndReviewId({
      userId: args.userId,
      mediaReviewId: args.body.mediaReviewId,
    })

    if (like) {
      await this.mediaReviewLikeRepository.delete(like.id)
    }

    return this.mediaReviewDislikeRepository.create({
      userId: args.userId,
      mediaDetailsId: mediaReview.mediaDetailsId,
      ...args.body,
    })
  }

  async deleteDislike(args: { id: string, userId: string }) {
    const dislike = await this.mediaReviewDislikeRepository.getById({ id: args.id })

    if (!dislike) {
      throw new MediaReviewDislikeNotFoundError({ mediaReviewDislikeId: args.id })
    }

    if (dislike.userId !== args.userId) {
      throw new MediaReviewUnauthorizedError({ userId: args.userId })
    }

    return this.mediaReviewDislikeRepository.delete(args.id)
  }
}
