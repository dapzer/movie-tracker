import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { UserDto } from "@/services/auth/dto/user.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { CreateMediaReviewDto } from "@/services/mediaReviews/dto/createMediaReview.dto"
import { CreateMediaReviewDislikeDto } from "@/services/mediaReviews/dto/createMediaReviewDislike.dto"
import { CreateMediaReviewLikeDto } from "@/services/mediaReviews/dto/createMediaReviewLike.dto"
import { UpdateMediaReviewDto } from "@/services/mediaReviews/dto/updateMediaReview.dto"
import { MediaReviewsService } from "@/services/mediaReviews/mediaReviews.service"
import { User } from "@/services/users/user.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("media-reviews")
export class MediaReviewsController {
  constructor(private readonly mediaReviewsService: MediaReviewsService) {
  }

  @Get(":id")
  async getMediaReviewById(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaReviewsService.getById({ id: params.id, currentUserId: user?.id })
  }

  @Get("by-media/:mediaId")
  async getMediaReviewsByMediaId(@User() user: UserDto, @Param("mediaId") mediaId: string, @Query() query: PaginationDto) {
    return this.mediaReviewsService.getByMediaId({
      mediaId: Number(mediaId),
      limit: query.limit,
      offset: query.offset,
      currentUserId: user?.id,
    })
  }

  @Get("by-user/:id")
  async getMediaReviewsByUserId(@Param() params: UuidDto, @Query() query: PaginationDto) {
    return this.mediaReviewsService.getByUserId({
      userId: params.id,
      limit: query.limit,
      offset: query.offset,
    })
  }

  @Post()
  @UseGuards(AuthGuard)
  async createMediaReview(@User() user: UserDto, @Body() body: CreateMediaReviewDto) {
    return this.mediaReviewsService.create({ userId: user.id, body })
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateMediaReview(
    @Param() params: UuidDto,
    @User() user: UserDto,
    @Body() body: UpdateMediaReviewDto,
  ) {
    return this.mediaReviewsService.update({ id: params.id, userId: user.id, body })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMediaReview(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaReviewsService.delete({ id: params.id, userId: user.id })
  }

  @Get(":id/likes")
  async getMediaReviewLikes(@Param() params: UuidDto) {
    return this.mediaReviewsService.getLikesByReviewId({ mediaReviewId: params.id })
  }

  @Post("likes")
  @UseGuards(AuthGuard)
  async createMediaReviewLike(@User() user: UserDto, @Body() body: CreateMediaReviewLikeDto) {
    return this.mediaReviewsService.createLike({ userId: user.id, body })
  }

  @Delete("likes/:id")
  @UseGuards(AuthGuard)
  async deleteMediaReviewLike(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaReviewsService.deleteLike({ id: params.id, userId: user.id })
  }

  @Get(":id/dislikes")
  async getMediaReviewDislikes(@Param() params: UuidDto) {
    return this.mediaReviewsService.getDislikesByReviewId({ mediaReviewId: params.id })
  }

  @Post("dislikes")
  @UseGuards(AuthGuard)
  async createMediaReviewDislike(@User() user: UserDto, @Body() body: CreateMediaReviewDislikeDto) {
    return this.mediaReviewsService.createDislike({ userId: user.id, body })
  }

  @Delete("dislikes/:id")
  @UseGuards(AuthGuard)
  async deleteMediaReviewDislike(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaReviewsService.deleteDislike({ id: params.id, userId: user.id })
  }
}
