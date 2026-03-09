import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { UserDto } from "@/services/auth/dto/user.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { CreateReleaseSubscriptionDto } from "@/services/releaseSubscription/dto/createReleaseSubscription.dto"
import { GetReleaseSubscriptionsByUserIdQueryDto } from "@/services/releaseSubscription/dto/getReleaseSubscriptionsByUserIdQuery.dto"
import { ReleaseSubscriptionService } from "@/services/releaseSubscription/releaseSubscription.service"
import { User } from "@/services/user/users.decorator"

@Controller("release-subscription")
export class ReleaseSubscriptionController {
  constructor(private readonly releaseSubscriptionService: ReleaseSubscriptionService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  async createReleaseSubscription(@Body() body: CreateReleaseSubscriptionDto, @User() user: UserDto) {
    return this.releaseSubscriptionService.create({ userId: user.id, mediaId: body.mediaId, mediaType: body.mediaType })
  }

  @Get()
  @UseGuards(AuthGuard)
  async getReleaseSubscriptionsByUserId(@Query() query: GetReleaseSubscriptionsByUserIdQueryDto, @User() user: UserDto) {
    return this.releaseSubscriptionService.getByUserId({
      userId: user.id,
      limit: query.limit,
      offset: query.offset,
      search: query.search,
      completed: query.completed,
      mediaType: query.mediaType,
      sortBy: query.sortBy,
      sortDirection: query.sortDirection,
    })
  }

  @Get("by-media/:mediaId")
  @UseGuards(AuthGuard)
  async getReleaseSubscriptionByMediaIdAndUserId(@Param("mediaId") mediaId: number, @User() user: UserDto) {
    return this.releaseSubscriptionService.getByMediaIdAndUserId({ mediaId, userId: user.id })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteReleaseSubscription(@Param("id") id: string, @User() user: UserDto) {
    return this.releaseSubscriptionService.delete({ id, userId: user.id })
  }
}
