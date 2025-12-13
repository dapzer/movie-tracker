import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import { UserDto } from "@/routes/auth/dto/user.dto"
import { AuthGuard } from "@/routes/auth/guards/auth.guard"
import { MarkNotificationsAsReadDto } from "@/routes/notification/dto/markNotificationsAsRead.dto"
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

  @Post("mark-as-read")
  @UseGuards(AuthGuard)
  async markNotificationsAsRead(@Body() body: MarkNotificationsAsReadDto, @User() user: UserDto) {
    return this.notificationService.markAsRead({ userId: user.id, ids: body.ids })
  }

  @Get("count")
  @UseGuards(AuthGuard)
  async getUnreadNotificationCount(@User() user: UserDto) {
    return this.notificationService.getCount({ userId: user.id })
  }
}
