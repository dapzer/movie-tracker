import { Module } from "@nestjs/common"
import { ReleaseSubscriptionsController } from "@/delivery/http/releaseSubscriptions/releaseSubscriptions.controller"
import { ReleaseSubscriptionsServiceModule } from "@/services/releaseSubscriptions/releaseSubscriptions.module"

@Module({
  imports: [ReleaseSubscriptionsServiceModule],
  controllers: [ReleaseSubscriptionsController],
})
export class ReleaseSubscriptionsHttpModule {}
