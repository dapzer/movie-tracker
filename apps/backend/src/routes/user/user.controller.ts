import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from "@nestjs/common"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { UpdateUserDto } from "@/routes/user/dto/updateUser.dto"
import { UserService } from "@/routes/user/user.service"
import { User } from "@/routes/user/users.decorator"
import { UuidDto } from "@/shared/dto/uuid.dto"
import { getPublicUser } from "@/shared/utils/getPublicUser"

@Controller("user")
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@User() user: UserDto) {
    return this.userService.getById(user?.id)
  }

  @Get(":id")
  async getUserById(@Param() params: UuidDto) {
    const user = await this.userService.getById(params.id)
    return getPublicUser(user)
  }

  @Get(":id/stats")
  async getUserStatById(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userService.getStatsByUserId({
      userId: params.id,
      currentUserId: user?.id,
    })
  }

  @Delete("/delete/:id")
  @UseGuards(AuthGuard)
  async deleteUser(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userService.delete(params.id, user?.id)
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateUser(@User() user: UserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.update(user?.id, updateUserDto)
  }
}
