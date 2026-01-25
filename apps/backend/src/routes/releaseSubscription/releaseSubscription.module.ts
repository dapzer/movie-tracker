import { Module } from "@nestjs/common"
import {
  PrismaReleaseSubscriptionRepository,
} from "@/repositories/releaseSubscription/PrismaReleaseSubscriptionRepository"
import {
  ReleaseSubscriptionRepositorySymbol,
} from "@/repositories/releaseSubscription/ReleaseSubscriptionRepositoryInterface"
import { MediaDetailsModule } from "@/routes/mediaDetails/mediaDetails.module"
import { ReleaseSubscriptionController } from "@/routes/releaseSubscription/releaseSubscription.controller"
import { ReleaseSubscriptionService } from "@/routes/releaseSubscription/releaseSubscription.service"

@Module({
  imports: [MediaDetailsModule],
  controllers: [ReleaseSubscriptionController],
  providers: [
    ReleaseSubscriptionService,
    {
      provide: ReleaseSubscriptionRepositorySymbol,
      useClass: PrismaReleaseSubscriptionRepository,
    },
  ],
  exports: [ReleaseSubscriptionService],
})
export class ReleaseSubscriptionModule {}
