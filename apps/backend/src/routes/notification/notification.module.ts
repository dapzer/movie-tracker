import { Module } from "@nestjs/common"
import { DrizzleNotificationRepository } from "@/repositories/notification/DrizzleNotificationRepository"
import { NotificationRepositorySymbol } from "@/repositories/notification/NotificationRepositoryInterface"
import { NotificationController } from "@/routes/notification/notification.controller"
import { NotificationService } from "@/routes/notification/notification.service"

@Module({
  imports: [],
  controllers: [NotificationController],
  providers: [
    NotificationService,
    {
      provide: NotificationRepositorySymbol,
      useClass: DrizzleNotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
