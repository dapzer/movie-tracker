import { Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { User } from "@/routes/user/users.decorator"
import { UserFollowService } from "@/routes/userFollow/userFollow.service"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("user")
export class UserFollowController {
  constructor(private readonly userFollowService: UserFollowService) {
  }

  @Get(":id/follow-information")
  async getUserFollowInformation(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userFollowService.getUserFollowInformation({
      userId: params.id,
      currentUserId: user?.id,
    })
  }

  @Get(":id/followers")
  async getUserFollowers(@Param() params: UuidDto, @Query() query: PaginationDto) {
    return this.userFollowService.getUserFollowers({
      userId: params.id,
      limit: query.limit,
      offset: query.offset,
    })
  }

  @Post(":id/follow")
  @UseGuards(AuthGuard)
  async createUserFollow(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userFollowService.createUserFollow({
      followerUserId: user.id,
      followingUserId: params.id,
    })
  }

  @Delete(":id/follow")
  @UseGuards(AuthGuard)
  async deleteUserFollow(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userFollowService.deleteUserFollow({
      followerUserId: user.id,
      followingUserId: params.id,
    })
  }
}
