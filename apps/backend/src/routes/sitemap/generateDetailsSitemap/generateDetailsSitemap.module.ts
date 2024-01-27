import { Module } from "@nestjs/common";
import { GenerateDetailsSitemapService } from "@/routes/sitemap/generateDetailsSitemap/generateDetailsSitemap.service";

@Module({
  imports: [],
  controllers: [],
  providers: [GenerateDetailsSitemapService],
  exports: [GenerateDetailsSitemapService],
})
export class GenerateDetailsSitemapModule {}
