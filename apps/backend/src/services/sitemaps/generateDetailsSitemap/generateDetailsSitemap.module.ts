import { Module } from "@nestjs/common"
import { GenerateDetailsSitemapsService } from "@/services/sitemaps/generateDetailsSitemap/generateDetailsSitemap.service"

@Module({
  imports: [],
  controllers: [],
  providers: [GenerateDetailsSitemapsService],
  exports: [GenerateDetailsSitemapsService],
})
export class GenerateDetailsSitemapModule {}
