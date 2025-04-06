import { GenerateDetailsSitemapModule } from "@/routes/sitemap/generateDetailsSitemap/generateDetailsSitemap.module"
import { GenerateDetailsSitemapService } from "@/routes/sitemap/generateDetailsSitemap/generateDetailsSitemap.service"
import { SitemapController } from "@/routes/sitemap/sitemap.controller"
import { SitemapService } from "@/routes/sitemap/sitemap.service"
import { Module } from "@nestjs/common"

@Module({
  imports: [GenerateDetailsSitemapModule],
  controllers: [SitemapController],
  providers: [GenerateDetailsSitemapService, SitemapService],
})
export class SitemapModule {}
