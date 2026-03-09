import { Module } from "@nestjs/common"
import { DrizzleNotificationRepository } from "@/repositories/notification/DrizzleNotificationRepository"
import { NotificationRepositorySymbol } from "@/repositories/notification/NotificationRepositoryInterface"
import { NotificationService } from "@/services/notification/notification.service"

@Module({
  providers: [
    NotificationService,
    { provide: NotificationRepositorySymbol, useClass: DrizzleNotificationRepository },
  ],
  exports: [NotificationService],
})
export class NotificationServiceModule {}
