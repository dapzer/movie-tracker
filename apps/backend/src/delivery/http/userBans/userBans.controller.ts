import { UserRoleEnum } from "@movie-tracker/types"
import { Body, Controller, Get, Param, Patch, Post, Query, UseGuards } from "@nestjs/common"
import { RolesWithDocs } from "@/decorators/rolesWithDocs.decorator"
import { RolesGuard } from "@/guards/roles.guard"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { CreateUserBanDto } from "@/services/userBans/dto/createUserBan.dto"
import { GetUserBansQueryDto } from "@/services/userBans/dto/getUserBansQuery.dto"
import { UserBansService } from "@/services/userBans/userBans.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { CreateUserBanDocs, GetUserBanDocs, GetUserBansDocs, RevokeUserBanDocs, UserBansControllerDocs } from "./userBans.controller.docs"

@UserBansControllerDocs()
@Controller("user-bans")
@UseGuards(AuthGuard)
export class UserBansController {
  constructor(private readonly userBansService: UserBansService) {}

  @Get()
  @RolesWithDocs([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @GetUserBansDocs()
  async getList(@Query() query: GetUserBansQueryDto) {
    return this.userBansService.getList(query)
  }

  @Get(":id")
  @RolesWithDocs([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @GetUserBanDocs()
  async getById(@Param() params: UuidDto) {
    return this.userBansService.getById(params.id)
  }

  @Post()
  @RolesWithDocs([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @CreateUserBanDocs()
  async create(@User() user: UserDto, @Body() body: CreateUserBanDto) {
    return this.userBansService.create({
      body,
      currentUserId: user.id,
    })
  }

  @Patch(":id/revoke")
  @RolesWithDocs([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  @RevokeUserBanDocs()
  async revoke(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userBansService.revoke({
      id: params.id,
      currentUserId: user.id,
    })
  }
}
