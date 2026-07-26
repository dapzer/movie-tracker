import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { GetMediaReviewsByMediaIdQueryDto } from "@/delivery/http/mediaReviews/dto/getMediaReviewsByMediaIdQuery.dto"
import { GetMediaReviewsByUserIdQueryDto } from "@/delivery/http/mediaReviews/dto/getMediaReviewsByUserIdQuery.dto"
import { GetMediaReviewsListQueryDto } from "@/delivery/http/mediaReviews/dto/getMediaReviewsListQuery.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { CreateMediaReviewDto } from "@/services/mediaReviews/dto/createMediaReview.dto"
import { CreateMediaReviewDislikeDto } from "@/services/mediaReviews/dto/createMediaReviewDislike.dto"
import { CreateMediaReviewLikeDto } from "@/services/mediaReviews/dto/createMediaReviewLike.dto"
import { UpdateMediaReviewDto } from "@/services/mediaReviews/dto/updateMediaReview.dto"
import { MediaReviewsService } from "@/services/mediaReviews/mediaReviews.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"
import {
  CreateMediaReviewDislikeDocs,
  CreateMediaReviewDocs,
  CreateMediaReviewLikeDocs,
  DeleteMediaReviewDislikeDocs,
  DeleteMediaReviewDocs,
  DeleteMediaReviewLikeDocs,
  GetMediaReviewByCurrentUserAndMediaIdDocs,
  GetMediaReviewByIdDocs,
  GetMediaReviewDislikesDocs,
  GetMediaReviewLikesDocs,
  GetMediaReviewsByMediaIdDocs,
  GetMediaReviewsByUserIdDocs,
  GetMediaReviewsListDocs,
  MediaReviewsControllerDocs,
  UpdateMediaReviewDocs,
} from "./mediaReviews.controller.docs"

@MediaReviewsControllerDocs()
@Controller("media-reviews")
export class MediaReviewsController {
  constructor(private readonly mediaReviewsService: MediaReviewsService) {
  }

  @Get()
  @GetMediaReviewsListDocs()
  async getMediaReviewsList(@User() user: UserDto, @Query() query: GetMediaReviewsListQueryDto) {
    return this.mediaReviewsService.getList({
      limit: query.limit,
      offset: query.offset,
      currentUser: user,
      status: query.status,
    })
  }

  @Get("by-current-user-and-media/:mediaId")
  @UseGuards(AuthGuard)
  @GetMediaReviewByCurrentUserAndMediaIdDocs()
  async getMediaReviewByCurrentUserAndMediaId(@User() user: UserDto, @Param("mediaId") mediaId: string) {
    return this.mediaReviewsService.getByCurrentUserAndMediaId({
      mediaId: Number(mediaId),
      currentUserId: user.id,
    })
  }

  @Get(":id")
  @GetMediaReviewByIdDocs()
  async getMediaReviewById(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaReviewsService.getById({ id: params.id, currentUserId: user?.id })
  }

  @Get("by-media/:mediaId")
  @GetMediaReviewsByMediaIdDocs()
  async getMediaReviewsByMediaId(@User() user: UserDto, @Param("mediaId") mediaId: string, @Query() query: GetMediaReviewsByMediaIdQueryDto) {
    return this.mediaReviewsService.getByMediaId({
      mediaId: Number(mediaId),
      limit: query.limit,
      offset: query.offset,
      currentUser: user,
    })
  }

  @Get("by-user/:id")
  @GetMediaReviewsByUserIdDocs()
  async getMediaReviewsByUserId(@Param() params: UuidDto, @Query() query: GetMediaReviewsByUserIdQueryDto, @User() user: UserDto) {
    return this.mediaReviewsService.getByUserId({
      userId: params.id,
      limit: query.limit,
      offset: query.offset,
      currentUser: user,
      status: query.status,
    })
  }

  @Post()
  @UseGuards(AuthGuard)
  @CreateMediaReviewDocs()
  async createMediaReview(@User() user: UserDto, @Body() body: CreateMediaReviewDto) {
    return this.mediaReviewsService.create({ userId: user.id, body })
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @UpdateMediaReviewDocs()
  async updateMediaReview(
    @Param() params: UuidDto,
    @User() user: UserDto,
    @Body() body: UpdateMediaReviewDto,
  ) {
    return this.mediaReviewsService.update({ id: params.id, body, currentUser: user })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @DeleteMediaReviewDocs()
  async deleteMediaReview(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaReviewsService.delete({ id: params.id, userId: user.id })
  }

  @Get(":id/likes")
  @GetMediaReviewLikesDocs()
  async getMediaReviewLikes(@Param() params: UuidDto) {
    return this.mediaReviewsService.getLikesByReviewId({ mediaReviewId: params.id })
  }

  @Post("likes")
  @UseGuards(AuthGuard)
  @CreateMediaReviewLikeDocs()
  async createMediaReviewLike(@User() user: UserDto, @Body() body: CreateMediaReviewLikeDto) {
    return this.mediaReviewsService.createLike({ userId: user.id, body })
  }

  @Delete("likes/:id")
  @UseGuards(AuthGuard)
  @DeleteMediaReviewLikeDocs()
  async deleteMediaReviewLike(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaReviewsService.deleteLike({ id: params.id, userId: user.id })
  }

  @Get(":id/dislikes")
  @GetMediaReviewDislikesDocs()
  async getMediaReviewDislikes(@Param() params: UuidDto) {
    return this.mediaReviewsService.getDislikesByReviewId({ mediaReviewId: params.id })
  }

  @Post("dislikes")
  @UseGuards(AuthGuard)
  @CreateMediaReviewDislikeDocs()
  async createMediaReviewDislike(@User() user: UserDto, @Body() body: CreateMediaReviewDislikeDto) {
    return this.mediaReviewsService.createDislike({ userId: user.id, body })
  }

  @Delete("dislikes/:id")
  @UseGuards(AuthGuard)
  @DeleteMediaReviewDislikeDocs()
  async deleteMediaReviewDislike(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaReviewsService.deleteDislike({ id: params.id, userId: user.id })
  }
}
