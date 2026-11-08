import { Inject, Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import {
  AiProviderInterface,
  AiProvidersSymbol,
  AiStructuredClientInterface,
  AiStructuredGenerationArgs,
} from "@/services/ai/aiProvider.interface"
import { AiProviderConfigurationError } from "@/shared/errors/ai"

@Injectable()
export class AiService implements AiStructuredClientInterface {
  constructor(
    @Inject(AiProvidersSymbol)
    private readonly providers: AiProviderInterface[],
    private readonly configService: ConfigService,
  ) {}

  async generateStructured(args: AiStructuredGenerationArgs): Promise<unknown> {
    const providerName = this.configService.get<string>("AI_PROVIDER") ?? "openrouter"
    const provider = this.providers.find(candidate => candidate.name === providerName)

    if (!provider) {
      throw new AiProviderConfigurationError({ message: `AI provider '${providerName}' is not registered.` })
    }

    return provider.generateStructured(args)
  }
}
