import { Module } from "@nestjs/common"
import { AiService } from "@/services/ai/ai.service"
import { AiProvidersSymbol } from "@/services/ai/aiProvider.interface"
import { OpenRouterProvider } from "@/services/ai/providers/openRouter.provider"

@Module({
  providers: [
    AiService,
    OpenRouterProvider,
    {
      provide: AiProvidersSymbol,
      useFactory: (openRouterProvider: OpenRouterProvider) => [openRouterProvider],
      inject: [OpenRouterProvider],
    },
  ],
  exports: [AiService],
})
export class AiModule {}
