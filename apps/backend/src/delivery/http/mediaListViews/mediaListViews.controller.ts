import { Controller, Param, Post, UseGuards } from "@nestjs/common"
import { UserDto } from "@/services/auth/dto/user.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { MediaListViewsService } from "@/services/mediaListViews/mediaListViews.service"
import { User } from "@/services/users/user.decorator"

@Controller("media-list-views")
export class MediaListViewsController {
  constructor(private readonly mediaListViewsService: MediaListViewsService) {}

  @Post("send/:mediaListId")
  @UseGuards(AuthGuard)
  async sendMediaListView(
    @Param("mediaListId") mediaListId: string,
    @User() user: UserDto,
  ) {
    return this.mediaListViewsService.createOdUpdate({
      mediaListId,
      userId: user.id,
    })
  }
}
