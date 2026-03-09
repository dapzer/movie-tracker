import { Controller, Param, Post, UseGuards } from "@nestjs/common"
import { UserDto } from "@/services/auth/dto/user.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { MediaListViewService } from "@/services/mediaListView/mediaListView.service"
import { User } from "@/services/user/users.decorator"

@Controller("media-list-view")
export class MediaListViewController {
  constructor(private readonly mediaListViewService: MediaListViewService) {}

  @Post("send/:mediaListId")
  @UseGuards(AuthGuard)
  async sendMediaListView(
    @Param("mediaListId") mediaListId: string,
    @User() user: UserDto,
  ) {
    return this.mediaListViewService.createOdUpdate({
      mediaListId,
      userId: user.id,
    })
  }
}
