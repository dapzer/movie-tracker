import { Module } from "@nestjs/common"
import { AiService } from "@/services/ai/ai.service"
import { AiProvidersSymbol } from "@/services/ai/aiProvider.interface"
import { OpenCodeGoProvider } from "@/services/ai/providers/opencodeGo.provider"
import { OpenRouterProvider } from "@/services/ai/providers/openRouter.provider"

@Module({
  providers: [
    AiService,
    OpenCodeGoProvider,
    OpenRouterProvider,
    {
      provide: AiProvidersSymbol,
      useFactory: (opencodeGoProvider: OpenCodeGoProvider, openRouterProvider: OpenRouterProvider) => [
        opencodeGoProvider,
        openRouterProvider,
      ],
      inject: [OpenCodeGoProvider, OpenRouterProvider],
    },
  ],
  exports: [AiService],
})
export class AiModule {}
