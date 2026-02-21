import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { CreateMediaRatingDto } from "@/routes/mediaRating/dto/createMediaRating.dto"
import { GetMediaRatingByMediaIdParamsDto } from "@/routes/mediaRating/dto/getMediaRatingByMediaIdParamsDto"
import { UpdateMediaRatingDto } from "@/routes/mediaRating/dto/updateMediaRating.dto"
import { MediaRatingService } from "@/routes/mediaRating/mediaRating.service"
import { User } from "@/routes/user/users.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("media-rating")
export class MediaRatingController {
  constructor(private readonly mediaRatingService: MediaRatingService) {}

  @Get("by-media/:mediaId")
  @UseGuards(AuthGuard)
  async getMediaRatingByCurrentUserId(
    @Param() params: GetMediaRatingByMediaIdParamsDto,
    @User() user: UserDto,
  ) {
    return this.mediaRatingService.getByMediaId(
      {
        mediaId: params.mediaId,
        userId: user.id,
      },
    )
  }

  @Get("by-user-id/:id")
  async getMediaRatingsByUserId(@Param() params: UuidDto, @Query() query: PaginationDto, @User() user: UserDto) {
    return this.mediaRatingService.getByUserId(
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
  async createMediaRating(@User() user: UserDto, @Body() body: CreateMediaRatingDto) {
    return this.mediaRatingService.create({
      userId: user.id,
      body,
    })
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateMediaRating(@Param() params: UuidDto, @User() user: UserDto, @Body() body: UpdateMediaRatingDto) {
    return this.mediaRatingService.update({
      id: params.id,
      userId: user.id,
      body,
    })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMediaRating(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaRatingService.delete({
      id: params.id,
      userId: user.id,
    })
  }
}
