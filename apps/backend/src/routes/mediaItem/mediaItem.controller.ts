import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { CreateMediaItemDto } from "@/routes/mediaItem/dto/createMediaItem.dto"
import { CreateMediaItemCloneDto } from "@/routes/mediaItem/dto/createMediaItemClone.dto"
import { UpdateMediaItemDto } from "@/routes/mediaItem/dto/updateMediaItem.dto"
import { MediaItemService } from "@/routes/mediaItem/mediaItem.service"
import { User } from "@/routes/user/users.decorator"
import { MediaItemListIdDto } from "@/shared/dto/mediaItemListId.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { Body, Controller, Delete, Get, Param, Patch, Post, UseGuards } from "@nestjs/common"
import { isCuid } from "@paralleldrive/cuid2"

@Controller("media-item")
export class MediaItemController {
  constructor(private readonly mediaItemService: MediaItemService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createMediaItem(
    @Body() body: CreateMediaItemDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemService.createMediaItem(
      body.mediaId,
      body.mediaType,
      body.mediaListId,
      user?.id,
      body.currentStatus,
    )
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMediaItemsByUserId(@User() user: UserDto) {
    return this.mediaItemService.getMediaItemsByUserId(user?.id)
  }

  @Get("/media-list/:mediaListId")
  async getMediaItemsByListId(
    @Param() param: MediaItemListIdDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemService.getMediaItemsByListId(
      param.mediaListId,
      user?.id,
      isCuid(param.mediaListId),
    )
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMediaItem(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaItemService.deleteMediaItem(params.id, user?.id)
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateMediaItem(
    @Param() param: UuidDto,
    @Body() body: UpdateMediaItemDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemService.updateMediaItem(param.id, user?.id, body)
  }

  @Post(":id/clone")
  @UseGuards(AuthGuard)
  async cloneMediaItem(
    @Param() param: UuidDto,
    @User() user: UserDto,
    @Body() body: CreateMediaItemCloneDto,
  ) {
    return this.mediaItemService.createMediaItemClone(
      param.id,
      user?.id,
      body.mediaListId,
      body.isSaveCreationDate,
    )
  }
}
