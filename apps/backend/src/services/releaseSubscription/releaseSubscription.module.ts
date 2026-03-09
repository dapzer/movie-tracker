import { Module } from "@nestjs/common"
import { DrizzleReleaseSubscriptionRepository } from "@/repositories/releaseSubscription/DrizzleReleaseSubscriptionRepository"
import { ReleaseSubscriptionRepositorySymbol } from "@/repositories/releaseSubscription/ReleaseSubscriptionRepositoryInterface"
import { MediaDetailsServiceModule } from "@/services/mediaDetails/mediaDetails.module"
import { ReleaseSubscriptionService } from "@/services/releaseSubscription/releaseSubscription.service"

@Module({
  imports: [MediaDetailsServiceModule],
  providers: [
    ReleaseSubscriptionService,
    { provide: ReleaseSubscriptionRepositorySymbol, useClass: DrizzleReleaseSubscriptionRepository },
  ],
  exports: [ReleaseSubscriptionService],
})
export class ReleaseSubscriptionServiceModule {}
