import { Body, Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { CreateReleaseSubscriptionDto } from "@/routes/releaseSubscription/dto/createReleaseSubscription.dto"
import { ReleaseSubscriptionService } from "@/routes/releaseSubscription/releaseSubscription.service"
import { User } from "@/routes/user/users.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

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
  async getReleaseSubscriptionsByUserId(@Query() query: PaginationDto, @User() user: UserDto) {
    return this.releaseSubscriptionService.getByUserId({ userId: user.id, limit: query.limit, offset: query.offset })
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
