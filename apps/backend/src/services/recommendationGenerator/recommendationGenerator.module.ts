import { Module } from "@nestjs/common"
import { AiModule } from "@/services/ai/ai.module"
import { RecommendationGeneratorService } from "@/services/recommendationGenerator/recommendationGenerator.service"

@Module({
  imports: [AiModule],
  providers: [RecommendationGeneratorService],
  exports: [RecommendationGeneratorService],
})
export class RecommendationGeneratorModule {}
