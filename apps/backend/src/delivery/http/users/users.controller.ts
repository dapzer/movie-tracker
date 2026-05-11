import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
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
  GetUserStatsDocs,
  UpdateUserDocs,
  UsersControllerDocs,
} from "./users.controller.docs"

@UsersControllerDocs()
@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

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
