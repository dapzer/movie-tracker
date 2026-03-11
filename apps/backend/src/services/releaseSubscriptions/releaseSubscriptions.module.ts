import { Module } from "@nestjs/common"
import { DrizzleReleaseSubscriptionRepository } from "@/repositories/releaseSubscription/DrizzleReleaseSubscriptionRepository"
import { ReleaseSubscriptionRepositorySymbol } from "@/repositories/releaseSubscription/ReleaseSubscriptionRepositoryInterface"
import { MediaDetailsServiceModule } from "@/services/mediaDetails/mediaDetails.module"
import { ReleaseSubscriptionsService } from "@/services/releaseSubscriptions/releaseSubscriptions.service"

@Module({
  imports: [MediaDetailsServiceModule],
  providers: [
    ReleaseSubscriptionsService,
    { provide: ReleaseSubscriptionRepositorySymbol, useClass: DrizzleReleaseSubscriptionRepository },
  ],
  exports: [ReleaseSubscriptionsService],
})
export class ReleaseSubscriptionsServiceModule {}
