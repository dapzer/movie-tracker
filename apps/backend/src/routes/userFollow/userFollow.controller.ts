import { Controller, Delete, Get, Param, Post, UseGuards } from "@nestjs/common"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { User } from "@/routes/user/users.decorator"
import { UserFollowService } from "@/routes/userFollow/userFollow.service"
import { UuidDto } from "@/shared/dto/uuid.dto"

@Controller("user")
export class UserFollowController {
  constructor(private readonly userFollowService: UserFollowService) {
  }

  @Get(":id/follow-information")
  async getUserFollowInformation(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userFollowService.getUserFollowInformation(params.id, user?.id)
  }

  @Get(":id/followers")
  async getUserFollowers(@Param() params: UuidDto) {
    return this.userFollowService.getUserFollowers(params.id)
  }

  @Post(":id/follow")
  @UseGuards(AuthGuard)
  async createUserFollow(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userFollowService.createUserFollow(user.id, params.id)
  }

  @Delete(":id/follow")
  @UseGuards(AuthGuard)
  async deleteUserFollow(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userFollowService.deleteUserFollow(user.id, params.id)
  }
}
