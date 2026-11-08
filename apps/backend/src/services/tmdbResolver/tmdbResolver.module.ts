import { Module } from "@nestjs/common"
import { TmdbResolverService } from "@/services/tmdbResolver/tmdbResolver.service"

@Module({
  providers: [TmdbResolverService],
  exports: [TmdbResolverService],
})
export class TmdbResolverModule {}
