import { Module } from "@nestjs/common"
import { NotificationsController } from "@/delivery/http/notifications/notifications.controller"
import { NotificationsServiceModule } from "@/services/notifications/notifications.module"

@Module({
  imports: [NotificationsServiceModule],
  controllers: [NotificationsController],
})
export class NotificationsModule {}
