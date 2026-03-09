import { Module } from "@nestjs/common"
import { SitemapController } from "@/delivery/http/sitemap/sitemap.controller"
import { SitemapServiceModule } from "@/services/sitemap/sitemap.module"

@Module({
  imports: [SitemapServiceModule],
  controllers: [SitemapController],
})
export class SitemapHttpModule {}
