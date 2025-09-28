import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  UseGuards,
} from "@nestjs/common"
import { isCuid } from "@paralleldrive/cuid2"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { CreateMediaListDto } from "@/routes/mediaList/dto/createMediaList.dto"
import { CreateMediaListCloneDto } from "@/routes/mediaList/dto/createMediaListClone.dto"
import { GetAllMediaListsDto } from "@/routes/mediaList/dto/getAllMediaLists.dto"
import { GetMedialListByIdDto } from "@/routes/mediaList/dto/getMedialListById.dto"
import { UpdateMediaListDto } from "@/routes/mediaList/dto/updateMediaList.dto"
import { MediaListService } from "@/routes/mediaList/mediaList.service"
import { User } from "@/routes/user/users.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("media-list")
export class MediaListController {
  constructor(private readonly mediaListService: MediaListService) {}

  @Get()
  async getMedialListsByUserId(
    @Query() queries: GetAllMediaListsDto,
    @User() user: UserDto,
  ) {
    if (queries.userId) {
      return this.mediaListService.getMedialListsByUserId(
        queries.userId,
        user?.id,
        true,
      )
    }

    if (!user) {
      throw new HttpException("Unauthorized", HttpStatus.UNAUTHORIZED)
    }

    return this.mediaListService.getMedialListsByUserId(user?.id, user?.id, false)
  }

  @Get(":id")
  async getMedialListById(
    @Param() params: GetMedialListByIdDto,
    @User() user: UserDto,
  ) {
    return this.mediaListService.getMedialListById(
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
    return this.mediaListService.createMediaList(user?.id, body)
  }

  @Post(":id/clone")
  @UseGuards(AuthGuard)
  async createMediaListClone(
    @Param() params: UuidDto,
    @User() user: UserDto,
    @Body() body: CreateMediaListCloneDto,
  ) {
    return this.mediaListService.createMediaListClone(
      params.id,
      user?.id,
      body,
    )
  }

  @Post(":id/like")
  @UseGuards(AuthGuard)
  async createMediaListLike(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaListService.createMediaListLike(params.id, user?.id)
  }

  @Delete(":id/like")
  @UseGuards(AuthGuard)
  async deleteMediaListLike(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaListService.deleteMediaListLike(params.id, user?.id)
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateMediaList(
    @Param() params: UuidDto,
    @Body() body: UpdateMediaListDto,
    @User() user: UserDto,
  ) {
    return this.mediaListService.updateMediaList(params.id, body, user?.id)
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMediaList(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaListService.deleteMediaList(params.id, user?.id)
  }
}
