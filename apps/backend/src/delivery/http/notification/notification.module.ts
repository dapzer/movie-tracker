import { Module } from "@nestjs/common"
import { NotificationController } from "@/delivery/http/notification/notification.controller"
import { NotificationServiceModule } from "@/services/notification/notification.module"

@Module({
  imports: [NotificationServiceModule],
  controllers: [NotificationController],
})
export class NotificationHttpModule {}
