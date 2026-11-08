import { Module } from "@nestjs/common"
import { DrizzleRecommendationRepository } from "@/repositories/recommendation/DrizzleRecommendationRepository"
import { RecommendationRepositorySymbol } from "@/repositories/recommendation/RecommendationRepositoryInterface"
import { MediaDetailsServiceModule } from "@/services/mediaDetails/mediaDetails.module"
import { RecommendationGeneratorModule } from "@/services/recommendationGenerator/recommendationGenerator.module"
import { RecommendationsService } from "@/services/recommendations/recommendations.service"
import { TmdbResolverModule } from "@/services/tmdbResolver/tmdbResolver.module"

@Module({
  imports: [RecommendationGeneratorModule, MediaDetailsServiceModule, TmdbResolverModule],
  providers: [
    RecommendationsService,
    { provide: RecommendationRepositorySymbol, useClass: DrizzleRecommendationRepository },
  ],
  exports: [RecommendationsService],
})
export class RecommendationsServiceModule {}
