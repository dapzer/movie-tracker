import { Module } from "@nestjs/common"
import { DrizzleNotificationRepository } from "@/repositories/notification/DrizzleNotificationRepository"
import { NotificationRepositorySymbol } from "@/repositories/notification/NotificationRepositoryInterface"
import { NotificationsService } from "@/services/notifications/notifications.service"

@Module({
  providers: [
    NotificationsService,
    { provide: NotificationRepositorySymbol, useClass: DrizzleNotificationRepository },
  ],
  exports: [NotificationsService],
})
export class NotificationsServiceModule {}
