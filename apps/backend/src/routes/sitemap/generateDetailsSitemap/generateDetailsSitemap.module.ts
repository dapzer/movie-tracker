import { GenerateDetailsSitemapService } from "@/routes/sitemap/generateDetailsSitemap/generateDetailsSitemap.service"
import { Module } from "@nestjs/common"

@Module({
  imports: [],
  controllers: [],
  providers: [GenerateDetailsSitemapService],
  exports: [GenerateDetailsSitemapService],
})
export class GenerateDetailsSitemapModule {}
