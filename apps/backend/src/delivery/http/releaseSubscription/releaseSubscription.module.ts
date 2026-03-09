import { Module } from "@nestjs/common"
import { ReleaseSubscriptionController } from "@/delivery/http/releaseSubscription/releaseSubscription.controller"
import { ReleaseSubscriptionServiceModule } from "@/services/releaseSubscription/releaseSubscription.module"

@Module({
  imports: [ReleaseSubscriptionServiceModule],
  controllers: [ReleaseSubscriptionController],
})
export class ReleaseSubscriptionHttpModule {}
