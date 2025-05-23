import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { CreateMediaRatingDto } from "@/routes/mediaRating/dto/createMediaRating.dto"
import { GetMediaRatingByUserIdQueryDto } from "@/routes/mediaRating/dto/getMediaRatingByUserIdQuery.dto"
import { UpdateMediaRatingDto } from "@/routes/mediaRating/dto/updateMediaRating.dto"
import { MediaRatingService } from "@/routes/mediaRating/mediaRating.service"
import { User } from "@/routes/user/users.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"

@Controller("media-rating")
export class MediaRatingController {
  constructor(private readonly mediaRatingService: MediaRatingService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getMediaRatingByUserId(
    @Query() query: GetMediaRatingByUserIdQueryDto,
    @User() user: UserDto,
  ) {
    return this.mediaRatingService.getMediaRatingByUserId(
      {
        mediaType: query.mediaType,
        mediaId: query.mediaId,
        userId: user.id,
      },
    )
  }

  @Post()
  @UseGuards(AuthGuard)
  async createMediaRating(@User() user: UserDto, @Body() body: CreateMediaRatingDto) {
    return this.mediaRatingService.createMediaRating({
      userId: user.id,
      body,
    })
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateMediaRating(@Param() params: UuidDto, @User() user: UserDto, @Body() body: UpdateMediaRatingDto) {
    return this.mediaRatingService.updateMediaRating({
      id: params.id,
      userId: user.id,
      body,
    })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMediaRating(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaRatingService.deleteMediaRating({
      id: params.id,
      userId: user.id,
    })
  }
}
