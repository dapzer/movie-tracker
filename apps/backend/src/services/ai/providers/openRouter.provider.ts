import { FetchClient, FetchError, HttpStatus } from "@movie-tracker/utils"
import { Injectable } from "@nestjs/common"
import { ConfigService } from "@nestjs/config"
import { z } from "zod"
import {
  AiProviderInterface,
  AiStructuredGenerationArgs,
} from "@/services/ai/aiProvider.interface"
import {
  AiProviderConfigurationError,
  AiProviderEmptyResponseError,
  AiProviderInvalidResponseError,
  AiProviderRequestError,
  AiProviderTokenLimitError,
} from "@/shared/errors/ai"

const openRouterResponseSchema = z.object({
  choices: z.array(z.object({
    finish_reason: z.string().nullish(),
    message: z.object({
      content: z.string().nullish(),
      refusal: z.string().nullish(),
    }),
  })).optional(),
  error: z.object({
    message: z.string().optional(),
  }).optional(),
})

@Injectable()
export class OpenRouterProvider implements AiProviderInterface {
  readonly name = "openrouter"
  private readonly client: FetchClient
  private readonly apiKey?: string
  private readonly model?: string
  private readonly timeoutMs: number

  constructor(configService: ConfigService) {
    const configuredApiUrl = configService.get<string>("OPENROUTER_API_URL") ?? "https://openrouter.ai/api/v1"
    const normalizedApiUrl = configuredApiUrl.replace(/\/+$/, "")
    const baseUrl = normalizedApiUrl.endsWith("/chat/completions")
      ? normalizedApiUrl.slice(0, -"/chat/completions".length)
      : normalizedApiUrl
    const configuredTimeout = Number(configService.get<number>("OPENROUTER_TIMEOUT_MS") ?? 60000)

    this.apiKey = configService.get<string>("OPENROUTER_API_KEY")
    this.model = configService.get<string>("OPENROUTER_MODEL")
    this.timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 60000
    this.client = new FetchClient({
      baseUrl,
      headers: {
        "Authorization": `Bearer ${this.apiKey ?? ""}`,
        "HTTP-Referer": configService.get<string>("API_BASE_URL") ?? "",
        "X-Title": "Movie Tracker",
      },
    })
  }

  async generateStructured(args: AiStructuredGenerationArgs): Promise<unknown> {
    if (!this.apiKey) {
      throw new AiProviderConfigurationError({ message: "OpenRouter API key is not configured." })
    }

    if (!this.model) {
      throw new AiProviderConfigurationError({ message: "OpenRouter model is not configured." })
    }

    let response: unknown
    try {
      response = await this.client.post<unknown>("chat/completions", {
        model: this.model,
        messages: [
          { role: "system", content: args.systemPrompt },
          { role: "user", content: args.userPrompt },
        ],
        response_format: {
          type: "json_schema",
          json_schema: {
            name: args.schemaName,
            strict: true,
            schema: args.schema,
          },
        },
        provider: {
          require_parameters: true,
        },
        temperature: args.temperature ?? 0.9,
        reasoning: args.disableReasoning ? { enabled: false } : undefined,
        max_tokens: args.maxTokens,
        stream: false,
      }, {
        signal: AbortSignal.timeout(this.timeoutMs),
        retries: {
          [HttpStatus.TOO_MANY_REQUESTS]: args.retryCount ?? 1,
          [HttpStatus.SERVICE_UNAVAILABLE]: args.retryCount ?? 1,
        },
      })
    }
    catch (error) {
      throw new AiProviderRequestError({
        cause: error,
        details: {
          provider: "openrouter",
          upstreamMessage: error instanceof Error ? error.message : String(error),
          ...(error instanceof FetchError ? { status: error.statusCode } : {}),
        },
      })
    }

    const parsedResponse = openRouterResponseSchema.safeParse(response)
    if (!parsedResponse.success) {
      throw new AiProviderInvalidResponseError({ cause: parsedResponse.error })
    }

    if (parsedResponse.data.error) {
      throw new AiProviderRequestError({
        message: "OpenRouter returned an error response.",
        details: { provider: "openrouter", upstreamMessage: parsedResponse.data.error.message },
      })
    }

    const choice = parsedResponse.data.choices?.[0]
    const message = choice?.message
    if (!message?.content || message.refusal) {
      const details = {
        provider: "openrouter",
        finishReason: choice?.finish_reason,
        refused: Boolean(message?.refusal),
      }
      if (choice?.finish_reason === "length") {
        throw new AiProviderTokenLimitError({ details })
      }
      throw new AiProviderEmptyResponseError({ details })
    }

    try {
      return JSON.parse(message.content) as unknown
    }
    catch (error) {
      throw new AiProviderInvalidResponseError({ cause: error })
    }
  }
}
