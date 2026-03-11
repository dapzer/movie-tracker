import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common"
import { UserDto } from "@/services/auth/dto/user.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { UpdateUserDto } from "@/services/users/dto/updateUser.dto"
import { User } from "@/services/users/user.decorator"
import { UsersService } from "@/services/users/users.service"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { getPublicUser } from "@/shared/utils/getPublicUser"

@Controller("users")
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get("/me")
  @UseGuards(AuthGuard)
  async getUser(@User() user: UserDto) {
    return this.usersService.getById(user?.id)
  }

  @Get(":id")
  async getUserById(@Param() params: UuidDto) {
    const user = await this.usersService.getById(params.id)
    return getPublicUser(user)
  }

  @Get(":id/stats")
  async getUserStatById(@Param() params: UuidDto, @User() user: UserDto) {
    return this.usersService.getStatsByUserId({
      userId: params.id,
      currentUserId: user?.id,
    })
  }

  @Delete("/delete/:id")
  @UseGuards(AuthGuard)
  async deleteUser(@Param() params: UuidDto, @User() user: UserDto) {
    return this.usersService.delete(params.id, user?.id)
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateUser(@User() user: UserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.usersService.update(user?.id, updateUserDto)
  }
}
