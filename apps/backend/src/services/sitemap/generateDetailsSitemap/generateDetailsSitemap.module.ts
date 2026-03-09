import { Module } from "@nestjs/common"
import { GenerateDetailsSitemapService } from "@/services/sitemap/generateDetailsSitemap/generateDetailsSitemap.service"

@Module({
  imports: [],
  controllers: [],
  providers: [GenerateDetailsSitemapService],
  exports: [GenerateDetailsSitemapService],
})
export class GenerateDetailsSitemapModule {}
