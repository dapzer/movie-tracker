import { Body, Controller, Delete, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { isCuid } from "@paralleldrive/cuid2"
import { UserDto } from "@/services/auth/dto/user.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { BulkCreateMediaItemDto } from "@/services/mediaItems/dto/bulkCreateMediaItem.dto"
import { BulkDeleteMediaItemDto } from "@/services/mediaItems/dto/bulkDeleteMediaItem.dto"
import { CreateMediaItemDto } from "@/services/mediaItems/dto/createMediaItem.dto"
import { CreateMediaItemCloneDto } from "@/services/mediaItems/dto/createMediaItemClone.dto"
import { GetMediaItemsByListIdQueryDto } from "@/services/mediaItems/dto/getMediaItemsByListIdQuery.dto"
import { GetMediaItemsByMediaIdParams } from "@/services/mediaItems/dto/getMediaItemsByMediaIdParams.dto"
import { GetMediaItemsCountByListIdQueryDto } from "@/services/mediaItems/dto/getMediaItemsCountByListIdQuery.dto"
import { UpdateMediaItemDto } from "@/services/mediaItems/dto/updateMediaItem.dto"
import { MediaItemsService } from "@/services/mediaItems/mediaItems.service"
import { User } from "@/services/users/user.decorator"
import { MediaItemListIdDto } from "@/shared/dto/mediaItemListId.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("media-items")
export class MediaItemsController {
  constructor(private readonly mediaItemsService: MediaItemsService) {}

  @Post()
  @UseGuards(AuthGuard)
  async createMediaItem(
    @Body() body: CreateMediaItemDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemsService.create({
      mediaId: body.mediaId,
      mediaType: body.mediaType,
      mediaListId: body.mediaListId,
      userId: user?.id,
      currentStatus: body.currentStatus,
    })
  }

  @Post("bulk")
  @UseGuards(AuthGuard)
  async bulkCreateMediaItem(
    @Body() body: BulkCreateMediaItemDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemsService.createBulk({
      userId: user?.id,
      items: body.items,
    })
  }

  @Get()
  @UseGuards(AuthGuard)
  async getMediaItemsByUserId(@User() user: UserDto) {
    return this.mediaItemsService.getByUserId({ userId: user?.id })
  }

  @Get("by-media-id/:mediaId")
  @UseGuards(AuthGuard)
  async getMediaItemsByMediaId(@User() user: UserDto, @Param() params: GetMediaItemsByMediaIdParams) {
    return this.mediaItemsService.getByMediaId({
      mediaId: params.mediaId,
      userId: user?.id,
    })
  }

  @Get("media-list/:mediaListId")
  async getMediaItemsByListId(
    @Param() param: MediaItemListIdDto,
    @Query() query: GetMediaItemsByListIdQueryDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemsService.getByListId({
      mediaListId: param.mediaListId,
      userId: user?.id,
      byHumanFriendlyId: isCuid(param.mediaListId),
      ...query,
    })
  }

  @Get("media-list/:mediaListId/count")
  async getMediaItemsCountByListId(
    @Param() param: MediaItemListIdDto,
    @User() user: UserDto,
    @Query() query: GetMediaItemsCountByListIdQueryDto,
  ) {
    return this.mediaItemsService.getCountByListId({
      mediaListId: param.mediaListId,
      userId: user?.id,
      search: query.search,
    })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteMediaItem(@Param() params: UuidDto, @User() user: UserDto) {
    return this.mediaItemsService.delete({ id: params.id, userId: user?.id })
  }

  @Post("bulk/delete")
  @UseGuards(AuthGuard)
  async bulkDeleteMediaItem(
    @Body() body: BulkDeleteMediaItemDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemsService.deleteBulk({
      ids: body.ids,
      userId: user?.id,
    })
  }

  @Patch(":id")
  @UseGuards(AuthGuard)
  async updateMediaItem(
    @Param() param: UuidDto,
    @Body() body: UpdateMediaItemDto,
    @User() user: UserDto,
  ) {
    return this.mediaItemsService.update({ id: param.id, userId: user?.id, data: body })
  }

  @Post(":id/clone")
  @UseGuards(AuthGuard)
  async cloneMediaItem(
    @Param() param: UuidDto,
    @User() user: UserDto,
    @Body() body: CreateMediaItemCloneDto,
  ) {
    return this.mediaItemsService.createClone({
      id: param.id,
      userId: user?.id,
      mediaListId: body.mediaListId,
      isSaveCreationDate: body.isSaveCreationDate,
    })
  }
}
