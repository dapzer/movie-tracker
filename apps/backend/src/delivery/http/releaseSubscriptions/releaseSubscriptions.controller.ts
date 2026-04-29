import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { CreateReleaseSubscriptionDto } from "@/services/releaseSubscriptions/dto/createReleaseSubscription.dto"
import {
  GetReleaseSubscriptionsByUserIdQueryDto,
} from "@/services/releaseSubscriptions/dto/getReleaseSubscriptionsByUserIdQuery.dto"
import { ReleaseSubscriptionsService } from "@/services/releaseSubscriptions/releaseSubscriptions.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"

@Controller("release-subscriptions")
export class ReleaseSubscriptionsController {
  constructor(private readonly releaseSubscriptionsService: ReleaseSubscriptionsService) {
  }

  @Post()
  @UseGuards(AuthGuard)
  async createReleaseSubscription(@Body() body: CreateReleaseSubscriptionDto, @User() user: UserDto) {
    return this.releaseSubscriptionsService.create({ userId: user.id, mediaId: body.mediaId, mediaType: body.mediaType })
  }

  @Get()
  @UseGuards(AuthGuard)
  async getReleaseSubscriptionsByUserId(@Query() query: GetReleaseSubscriptionsByUserIdQueryDto, @User() user: UserDto) {
    return this.releaseSubscriptionsService.getByUserId({
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
    return this.releaseSubscriptionsService.getByMediaIdAndUserId({ mediaId, userId: user.id })
  }

  @Delete(":id")
  @UseGuards(AuthGuard)
  async deleteReleaseSubscription(@Param("id") id: string, @User() user: UserDto) {
    return this.releaseSubscriptionsService.delete({ id, userId: user.id })
  }
}
