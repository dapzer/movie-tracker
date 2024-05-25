import { Body, Controller, Delete, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { UserService } from '@/routes/user/user.service';
import { User } from '@/routes/user/users.decorator';
import { UserDto } from '@/routes/auth/dto/user.dto';
import { UuidDto } from '@/shared/dto/uuid.dto';
import { AuthGuard } from '@/routes/auth/guards/auth.guard';
import { UpdateUserDto } from '@/routes/user/dto/updateUser.dto';

@Controller('user')
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get()
  @UseGuards(AuthGuard)
  async getUser(@User() user: UserDto) {
    return this.userService.getUser(user?.id);
  }

  @Get(':id')
  async getUserById(@Param() params: UuidDto) {
    return this.userService.getUser(params.id);
  }

  @Delete('/delete/:id')
  @UseGuards(AuthGuard)
  async deleteUser(@Param() params: UuidDto, @User() user: UserDto) {
    return this.userService.deleteUser(params.id, user?.id);
  }

  @Patch()
  @UseGuards(AuthGuard)
  async updateUser(@User() user: UserDto, @Body() updateUserDto: UpdateUserDto) {
    return this.userService.updateUser(user?.id, updateUserDto);
  }
}
