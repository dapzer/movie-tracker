import { Module } from "@nestjs/common"
import { SitemapsController } from "@/delivery/http/sitemaps/sitemaps.controller"
import { SitemapsServiceModule } from "@/services/sitemaps/sitemaps.module"

@Module({
  imports: [SitemapsServiceModule],
  controllers: [SitemapsController],
})
export class SitemapsModule {}
