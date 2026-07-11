import { UserRoleEnum } from "@movie-tracker/types"
import { Body, Controller, Delete, Get, Param, Patch, Query, UseGuards } from "@nestjs/common"
import { RolesWithDocs } from "@/decorators/rolesWithDocs.decorator"
import { RolesGuard } from "@/guards/roles.guard"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { GetUsersQueryDto } from "@/services/users/dto/getUsersQuery.dto"
import { UpdateUserDto } from "@/services/users/dto/updateUser.dto"
import { OptionalUserDto, UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { UsersService } from "@/services/users/users.service"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { getPublicUser } from "@/shared/utils/getPublicUser"
import {
  DeleteUserDocs,
  GetCurrentUserDocs,
  GetUserByIdDocs,
  GetUsersDocs,
  GetUserStatsDocs,
  UpdateUserDocs,
  UsersControllerDocs,
} from "./users.controller.docs"

@UsersControllerDocs()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @GetUsersDocs()
  @RolesWithDocs([UserRoleEnum.ADMIN])
  @UseGuards(RolesGuard)
  async getList(@Query() query: GetUsersQueryDto) {
    return this.usersService.getList(query)
  }

  @Get("/me")
  @UseGuards(AuthGuard)
  @GetCurrentUserDocs()
  async getUser(@User() user: UserDto) {
    return this.usersService.getById(user?.id)
  }

  @Get(":id")
  @GetUserByIdDocs()
  async getUserById(@Param() params: UuidDto) {
    const user = await this.usersService.getById(params.id)
    return getPublicUser(user)
  }

  @Get(":id/stats")
  @GetUserStatsDocs()
  async getUserStatById(@Param() params: UuidDto, @User() user: OptionalUserDto) {
    return this.usersService.getStatsByUserId({
      userId: params.id,
      currentUserId: user?.id,
    })
  }

  @Delete("/delete/:id")
  @UseGuards(AuthGuard)
  @DeleteUserDocs()
  async deleteUser(@Param() params: UuidDto, @User() user: UserDto) {
    return this.usersService.delete(params.id, user?.id)
  }

  @Patch()
  @UseGuards(AuthGuard)
  @UpdateUserDocs()
  async updateUser(@User() user: UserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user?.id, updateUserDto)
  }
}
