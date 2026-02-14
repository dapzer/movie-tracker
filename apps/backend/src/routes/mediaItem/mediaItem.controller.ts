import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { isCuid } from "@paralleldrive/cuid2"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { CreateMediaItemDto } from "@/routes/mediaItem/dto/createMediaItem.dto"
import { CreateMediaItemCloneDto } from "@/routes/mediaItem/dto/createMediaItemClone.dto"
import { GetMediaItemsByMediaIdParams } from "@/routes/mediaItem/dto/getMediaItemsByMediaIdParams.dto"
import { UpdateMediaItemDto } from "@/routes/mediaItem/dto/updateMediaItem.dto"
import { MediaItemService } from "@/routes/mediaItem/mediaItem.service"
import { User } from "@/routes/user/users.decorator"
import { MediaItemListIdDto } from "@/shared/dto/mediaItemListId.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("media-item")
export class MediaItemController {
  constructor(private readonly mediaItemService: MediaItemService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createMediaItem(
    @Body() body: CreateMediaItemDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemService.create({
      mediaId: body.mediaId,
      mediaType: body.mediaType,
      mediaListId: body.mediaListId,
      userId: user?.id,
      currentStatus: body.currentStatus,
    })
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMediaItemsByUserId(@User() user: UserDto) {
    return this.mediaItemService.getByUserId({ userId: user?.id })
  }

  @Get("by-media-id/:mediaId")
  @UseGuards(AuthGuard)
  async getMediaItemsByMediaId(@User() user: UserDto, @Param() params: GetMediaItemsByMediaIdParams) {
    return this.mediaItemService.getByMediaId({
      mediaId: params.mediaId,
      userId: user?.id,
    })
  }

  @Get("/media-list/:mediaListId")
  async getMediaItemsByListId(
    @Param() param: MediaItemListIdDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemService.getByListId({
      mediaListId: param.mediaListId,
      userId: user?.id,
      byHumanFriendlyId: isCuid(param.mediaListId),
    })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMediaItem(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaItemService.delete({ id: params.id, userId: user?.id })
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateMediaItem(
    @Param() param: UuidDto,
    @Body() body: UpdateMediaItemDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemService.update({ id: param.id, userId: user?.id, data: body })
  }

  @Post(":id/clone")
  @UseGuards(AuthGuard)
  async cloneMediaItem(
    @Param() param: UuidDto,
    @User() user: UserDto,
    @Body() body: CreateMediaItemCloneDto,
  ) {
    return this.mediaItemService.createClone({
      id: param.id,
      userId: user?.id,
      mediaListId: body.mediaListId,
      isSaveCreationDate: body.isSaveCreationDate,
    })
  }
}
