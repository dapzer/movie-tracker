import { Controller, Get, Query, UseGuards } from "@nestjs/common"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { NotificationService } from "@/routes/notification/notification.service"
import { User } from "@/routes/user/users.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"

@Controller("notification")
export class NotificationController {
  constructor(private readonly notificationService: NotificationService) {
  }

  @Get()
  @UseGuards(AuthGuard)
  async getNotificationsByUserId(@Query() query: PaginationDto, @User() user: UserDto) {
    return this.notificationService.getByUserId({ userId: user.id, limit: query.limit, offset: query.offset })
  }
}
