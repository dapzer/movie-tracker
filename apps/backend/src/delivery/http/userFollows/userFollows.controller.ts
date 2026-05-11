import { Controller, Delete, Get, Param, Post, Query, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { UserFollowsService } from "@/services/userFollows/userFollows.service"
import { OptionalUserDto, UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import { UuidDto } from "@/shared/dto/uuid.dto"
import {
  CreateUserFollowDocs,
  DeleteUserFollowDocs,
  GetUserFollowersDocs,
  GetUserFollowInformationDocs,
  GetUserFollowingsDocs,
  UserFollowsControllerDocs,
} from "./userFollows.controller.docs"

@UserFollowsControllerDocs()
@Controller("users")
export class UserFollowsController {
  constructor(private readonly userFollowsService: UserFollowsService) {}

  @Get(":id/follow-information")
  @GetUserFollowInformationDocs()
  async getUserFollowInformation(@Param() params: UuidDto, @User() user: OptionalUserDto) {
    return this.userFollowsService.getUserFollowInformation({
      userId: params.id,
      currentUserId: user?.id,
    })
  }

  @Get(":id/followers")
  @GetUserFollowersDocs()
  async getUserFollowers(@Param() params: UuidDto, @Query() query: PaginationDto, @User() user: OptionalUserDto) {
    return this.userFollowsService.getFollowers({
      userId: params.id,
      limit: query.limit,
      offset: query.offset,
      currentUserId: user?.id,
    })
  }

  @Get(":id/followings")
  @GetUserFollowingsDocs()
  async getUserFollowings(@Param() params: UuidDto, @Query() query: PaginationDto, @User() user: OptionalUserDto) {
    return this.userFollowsService.getFollowings({
      userId: params.id,
      limit: query.limit,
      offset: query.offset,
      currentUserId: user?.id,
    })
  }

  @Post(":id/follow")
  @UseGuards(AuthGuard)
  @CreateUserFollowDocs()
  async createUserFollow(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userFollowsService.create({
      followerUserId: user.id,
      followingUserId: params.id,
    })
  }

  @Delete(":id/follow")
  @UseGuards(AuthGuard)
  @DeleteUserFollowDocs()
  async deleteUserFollow(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userFollowsService.deleteUser({
      followerUserId: user.id,
      followingUserId: params.id,
    })
  }
}
