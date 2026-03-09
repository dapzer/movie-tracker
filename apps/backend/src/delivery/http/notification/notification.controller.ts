import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import { UserDto } from "@/services/auth/dto/user.dto"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { MarkNotificationsAsReadDto } from "@/services/notification/dto/markNotificationsAsRead.dto"
import { NotificationService } from "@/services/notification/notification.service"
import { User } from "@/services/user/users.decorator"
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

  @Post("mark-as-read/all")
  @UseGuards(AuthGuard)
  async markAllNotificationsAsRead(@User() user: UserDto) {
    return this.notificationService.markAllAsRead({ userId: user.id })
  }

  @Get("count")
  @UseGuards(AuthGuard)
  async getUnreadNotificationCount(@User() user: UserDto) {
    return this.notificationService.getCount({ userId: user.id })
  }
}
