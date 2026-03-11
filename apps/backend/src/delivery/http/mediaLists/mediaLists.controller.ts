import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { isCuid } from "@paralleldrive/cuid2"
import { UserDto } from "@/services/auth/dto/user.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { CreateMediaListDto } from "@/services/mediaLists/dto/createMediaList.dto"
import { CreateMediaListCloneDto } from "@/services/mediaLists/dto/createMediaListClone.dto"
import { GetAllMediaListsDto } from "@/services/mediaLists/dto/getAllMediaLists.dto"
import { GetMedialListByIdDto } from "@/services/mediaLists/dto/getMedialListById.dto"
import { UpdateMediaListDto } from "@/services/mediaLists/dto/updateMediaList.dto"
import { MediaListsService } from "@/services/mediaLists/mediaLists.service"
import { User } from "@/services/users/user.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { UnauthorizedError } from "@/shared/errors/core"

@Controller("media-lists")
export class MediaListsController {
  constructor(private readonly mediaListsService: MediaListsService) {}

  @Get()
  async getMedialListsByUserId(
    @Query() queries: GetAllMediaListsDto,
    @User() user: UserDto,
  ) {
    if (queries.userId) {
      return this.mediaListsService.getByUserId(
        queries.userId,
        user?.id,
        true,
      )
    }

    if (!user) {
      throw new UnauthorizedError()
    }

    return this.mediaListsService.getByUserId(user?.id, user?.id, false)
  }

  @Get(":id")
  async getMedialListById(
    @Param() params: GetMedialListByIdDto,
    @User() user: UserDto,
  ) {
    return this.mediaListsService.getById(
      params.id,
      user?.id,
      isCuid(params.id),
    )
  }

  @Post()
  @UseGuards(AuthGuard)
  async createMediaList(
    @User() user: UserDto,
    @Body() body: CreateMediaListDto,
  ) {
    return this.mediaListsService.create(user?.id, body)
  }

  @Post(":id/clone")
  @UseGuards(AuthGuard)
  async createMediaListClone(
    @Param() params: UuidDto,
    @User() user: UserDto,
    @Body() body: CreateMediaListCloneDto,
  ) {
    return this.mediaListsService.createClone(
      params.id,
      user?.id,
      body,
    )
  }

  @Post(":id/like")
  @UseGuards(AuthGuard)
  async createMediaListLike(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaListsService.createLike(params.id, user?.id)
  }

  @Delete(":id/like")
  @UseGuards(AuthGuard)
  async deleteMediaListLike(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaListsService.deleteLike(params.id, user?.id)
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateMediaList(
    @Param() params: UuidDto,
    @Body() body: UpdateMediaListDto,
    @User() user: UserDto,
  ) {
    return this.mediaListsService.update(params.id, body, user?.id)
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMediaList(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaListsService.delete(params.id, user?.id)
  }
}
