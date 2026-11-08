import { Module } from "@nestjs/common"
import { RecommendationsController } from "@/delivery/http/recommendations/recommendations.controller"
import { ThrottlerBehindProxyGuard } from "@/guards/throttlerBehindProxy.guard"
import { RecommendationsServiceModule } from "@/services/recommendations/recommendations.module"

@Module({
  imports: [RecommendationsServiceModule],
  controllers: [RecommendationsController],
  providers: [ThrottlerBehindProxyGuard],
})
export class RecommendationsModule {}
