import { Body, Controller, Get, Post, Query, UseGuards } from "@nestjs/common"
import { AuthGuard } from "@/services/auth/guards/auth.guard"
import { MarkNotificationsAsReadDto } from "@/services/notifications/dto/markNotificationsAsRead.dto"
import { NotificationsService } from "@/services/notifications/notifications.service"
import { UserDto } from "@/services/users/dto/user.dto"
import { User } from "@/services/users/user.decorator"
import { PaginationDto } from "@/shared/dto/pagination.dto"
import {
  GetNotificationsByUserIdDocs,
  GetUnreadNotificationCountDocs,
  MarkAllNotificationsAsReadDocs,
  MarkNotificationsAsReadDocs,
  NotificationsControllerDocs,
} from "./notifications.controller.docs"

@NotificationsControllerDocs()
@Controller("notifications")
export class NotificationsController {
  constructor(private readonly notificationsService: NotificationsService) {
  }

  @Get()
  @UseGuards(AuthGuard)
  @GetNotificationsByUserIdDocs()
  async getNotificationsByUserId(@Query() query: PaginationDto, @User() user: UserDto) {
    return this.notificationsService.getByUserId({ userId: user.id, limit: query.limit, offset: query.offset })
  }

  @Post("mark-as-read")
  @UseGuards(AuthGuard)
  @MarkNotificationsAsReadDocs()
  async markNotificationsAsRead(@Body() body: MarkNotificationsAsReadDto, @User() user: UserDto) {
    return this.notificationsService.markAsRead({ userId: user.id, ids: body.ids })
  }

  @Post("mark-as-read/all")
  @UseGuards(AuthGuard)
  @MarkAllNotificationsAsReadDocs()
  async markAllNotificationsAsRead(@User() user: UserDto) {
    return this.notificationsService.markAllAsRead({ userId: user.id })
  }

  @Get("count")
  @UseGuards(AuthGuard)
  @GetUnreadNotificationCountDocs()
  async getUnreadNotificationCount(@User() user: UserDto) {
    return this.notificationsService.getCount({ userId: user.id })
  }
}
