import { randomUUID } from "node:crypto"
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

const opencodeGoResponseSchema = z.object({
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
export class OpenCodeGoProvider implements AiProviderInterface {
  readonly name = "opencode-go"
  private readonly client: FetchClient
  private readonly apiKey?: string
  private readonly model?: string
  private readonly timeoutMs: number
  private readonly fallbackSessionId = `ses_${randomUUID()}`

  constructor(configService: ConfigService) {
    const baseUrl = configService.get<string>("OPENCODE_GO_API_URL")
    const configuredTimeout = Number(configService.get<number>("OPENCODE_GO_TIMEOUT_MS") ?? 60000)

    this.apiKey = configService.get<string>("OPENCODE_GO_API_KEY")
    this.model = configService.get<string>("OPENCODE_GO_MODEL")
    this.timeoutMs = Number.isFinite(configuredTimeout) && configuredTimeout > 0 ? configuredTimeout : 60000
    this.client = new FetchClient({
      baseUrl,
      headers: {
        "Authorization": `Bearer ${this.apiKey ?? ""}`,
        "User-Agent": "movie-tracker/1.0",
      },
    })
  }

  async generateStructured(args: AiStructuredGenerationArgs): Promise<unknown> {
    if (!this.apiKey) {
      throw new AiProviderConfigurationError({ message: "OpenCode Go API key is not configured." })
    }

    if (!this.model) {
      throw new AiProviderConfigurationError({ message: "OpenCode Go model is not configured." })
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
        temperature: args.temperature ?? 0.9,
        reasoning_effort: args.disableReasoning ? "low" : undefined,
        max_tokens: args.maxTokens,
        stream: false,
      }, {
        headers: {
          "x-opencode-session": args.sessionId ?? this.fallbackSessionId,
        },
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
          provider: this.name,
          upstreamMessage: error instanceof Error ? error.message : String(error),
          ...(error instanceof FetchError ? { status: error.statusCode } : {}),
        },
      })
    }

    const parsedResponse = opencodeGoResponseSchema.safeParse(response)
    if (!parsedResponse.success) {
      throw new AiProviderInvalidResponseError({ cause: parsedResponse.error })
    }

    if (parsedResponse.data.error) {
      throw new AiProviderRequestError({
        message: "OpenCode Go returned an error response.",
        details: { provider: this.name, upstreamMessage: parsedResponse.data.error.message },
      })
    }

    const choice = parsedResponse.data.choices?.[0]
    const message = choice?.message
    if (!message?.content || message.refusal) {
      const details = {
        provider: this.name,
        finishReason: choice?.finish_reason,
        refused: Boolean(message?.refusal),
      }
      if (choice?.finish_reason === "length") {
        throw new AiProviderTokenLimitError({ details })
      }
      throw new AiProviderEmptyResponseError({ details })
    }

    if (choice?.finish_reason === "length") {
      throw new AiProviderTokenLimitError({
        details: {
          provider: this.name,
          finishReason: choice.finish_reason,
          refused: false,
        },
      })
    }

    try {
      return JSON.parse(message.content) as unknown
    }
    catch (error) {
      throw new AiProviderInvalidResponseError({ cause: error })
    }
  }
}
