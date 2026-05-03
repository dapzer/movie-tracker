import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { CreateMediaRatingDto } from "@/services/mediaRatings/dto/createMediaRating.dto"
import { GetMediaRatingByMediaIdParamsDto } from "@/services/mediaRatings/dto/getMediaRatingByMediaIdParams.dto"
import { UpdateMediaRatingDto } from "@/services/mediaRatings/dto/updateMediaRating.dto"
import { MediaRatingsService } from "@/services/mediaRatings/mediaRatings.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"
import {
  CreateMediaRatingDocs,
  DeleteMediaRatingDocs,
  GetMediaRatingByCurrentUserIdDocs,
  GetMediaRatingsByUserIdDocs,
  GetRecentlyCreatedMediaRatingsDocs,
  MediaRatingsControllerDocs,
  UpdateMediaRatingDocs,
} from "./mediaRatings.controller.docs"

@MediaRatingsControllerDocs()
@Controller("media-ratings")
export class MediaRatingsController {
  constructor(private readonly mediaRatingsService: MediaRatingsService) {}

  @Get("recently-created")
  @GetRecentlyCreatedMediaRatingsDocs()
  async getRecentlyCreatedMediaRatings(@Query() query: PaginationDto) {
    return this.mediaRatingsService.getRecentlyCreated({
      limit: query.limit,
      offset: query.offset,
    })
  }

  @Get("by-media/:mediaId")
  @UseGuards(AuthGuard)
  @GetMediaRatingByCurrentUserIdDocs()
  async getMediaRatingByCurrentUserId(
    @Param() params: GetMediaRatingByMediaIdParamsDto,
    @User() user: UserDto,
  ) {
    return this.mediaRatingsService.getByMediaId(
      {
        mediaId: params.mediaId,
        userId: user.id,
      },
    )
  }

  @Get("by-user-id/:id")
  @GetMediaRatingsByUserIdDocs()
  async getMediaRatingsByUserId(@Param() params: UuidDto, @Query() query: PaginationDto, @User() user: UserDto) {
    return this.mediaRatingsService.getByUserId(
      {
        userId: params.id,
        currentUserId: user?.id,
        limit: query.limit,
        offset: query.offset,
      },
    )
  }

  @Post()
  @UseGuards(AuthGuard)
  @CreateMediaRatingDocs()
  async createMediaRating(@User() user: UserDto, @Body() body: CreateMediaRatingDto) {
    return this.mediaRatingsService.create({
      userId: user.id,
      body,
    })
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  @UpdateMediaRatingDocs()
  async updateMediaRating(@Param() params: UuidDto, @User() user: UserDto, @Body() body: UpdateMediaRatingDto) {
    return this.mediaRatingsService.update({
      id: params.id,
      userId: user.id,
      body,
    })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  @DeleteMediaRatingDocs()
  async deleteMediaRating(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaRatingsService.delete({
      id: params.id,
      userId: user.id,
    })
  }
}
