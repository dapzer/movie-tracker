import { Module } from "@nestjs/common"
import { AnalyticsController } from "@/delivery/http/analytics/analytics.controller"
import { AnalyticsServiceModule } from "@/services/analytics/analytics.module"

@Module({
  imports: [AnalyticsServiceModule],
  controllers: [AnalyticsController],
})
export class AnalyticsHttpModule {}
