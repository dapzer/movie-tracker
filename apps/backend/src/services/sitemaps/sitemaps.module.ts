import { Module } from "@nestjs/common"
import { GenerateDetailsSitemapModule } from "@/services/sitemaps/generateDetailsSitemap/generateDetailsSitemap.module"
import { GenerateDetailsSitemapsService } from "@/services/sitemaps/generateDetailsSitemap/generateDetailsSitemap.service"
import { SitemapsService } from "@/services/sitemaps/sitemaps.service"

@Module({
  imports: [GenerateDetailsSitemapModule],
  providers: [GenerateDetailsSitemapsService, SitemapsService],
  exports: [SitemapsService],
})
export class SitemapsServiceModule {}
