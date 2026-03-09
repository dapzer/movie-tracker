import { Module } from "@nestjs/common"
import { GenerateDetailsSitemapModule } from "@/services/sitemap/generateDetailsSitemap/generateDetailsSitemap.module"
import { GenerateDetailsSitemapService } from "@/services/sitemap/generateDetailsSitemap/generateDetailsSitemap.service"
import { SitemapService } from "@/services/sitemap/sitemap.service"

@Module({
  imports: [GenerateDetailsSitemapModule],
  providers: [GenerateDetailsSitemapService, SitemapService],
  exports: [SitemapService],
})
export class SitemapServiceModule {}
