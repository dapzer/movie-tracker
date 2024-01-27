import { Module } from '@nestjs/common';
import { SitemapController } from '@/routes/sitemap/sitemap.controller';
import { GenerateDetailsSitemapModule } from "@/routes/sitemap/generateDetailsSitemap/generateDetailsSitemap.module";
import { GenerateDetailsSitemapService } from "@/routes/sitemap/generateDetailsSitemap/generateDetailsSitemap.service";
import { SitemapService } from "@/routes/sitemap/sitemap.service";

@Module({
  imports: [GenerateDetailsSitemapModule],
  controllers: [SitemapController],
  providers: [GenerateDetailsSitemapService, SitemapService],
})
export class SitemapModule {}
