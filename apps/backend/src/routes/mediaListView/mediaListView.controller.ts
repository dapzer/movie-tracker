import { Controller, Param, Post, UseGuards } from "@nestjs/common"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { User } from "@/routes/user/users.decorator"
import { MediaListViewService } from "./mediaListView.service"

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
