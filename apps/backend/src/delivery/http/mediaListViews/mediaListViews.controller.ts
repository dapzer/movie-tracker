import { Controller, Param, Post, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { MediaListViewsService } from "@/services/mediaListViews/mediaListViews.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { MediaListViewsControllerDocs, SendMediaListViewDocs } from "./mediaListViews.controller.docs"

@Controller("media-list-views")
@MediaListViewsControllerDocs()
export class MediaListViewsController {
  constructor(private readonly mediaListViewsService: MediaListViewsService) {}

  @Post("send/:mediaListId")
  @SendMediaListViewDocs()
  @UseGuards(AuthGuard)
  async sendMediaListView(
    @Param("mediaListId") mediaListId: string,
    @User() user: UserDto,
  ) {
    return this.mediaListViewsService.createOrUpdate({
      mediaListId,
      userId: user.id,
    })
  }
}
