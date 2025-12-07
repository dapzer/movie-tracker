import { Module } from "@nestjs/common"
import { NotificationRepositorySymbol } from "@/repositories/notification/NotificationRepositoryInterface"
import { PrismaNotificationRepository } from "@/repositories/notification/PrismaNotificationRepository"
import { NotificationService } from "@/routes/notification/notification.service"

@Module({
  imports: [],
  controllers: [],
  providers: [
    NotificationService,
    {
      provide: NotificationRepositorySymbol,
      useClass: PrismaNotificationRepository,
    },
  ],
  exports: [NotificationService],
})
export class NotificationModule {}
