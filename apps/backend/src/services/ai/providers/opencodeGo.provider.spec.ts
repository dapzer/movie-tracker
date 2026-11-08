/* eslint-disable test/no-import-node-test -- Uses the existing Node/ts-node tooling without adding a test framework. */
import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { ConfigService } from "@nestjs/config"
import { AiStructuredGenerationArgs } from "@/services/ai/aiProvider.interface"
import { OpenCodeGoProvider } from "@/services/ai/providers/opencodeGo.provider"
import {
  AiProviderConfigurationError,
  AiProviderEmptyResponseError,
  AiProviderInvalidResponseError,
  AiProviderRequestError,
  AiProviderTokenLimitError,
} from "@/shared/errors/ai"

const originalFetch = globalThis.fetch
const generationArgs: AiStructuredGenerationArgs = {
  systemPrompt: "System prompt",
  userPrompt: "User prompt",
  schemaName: "structured_response",
  schema: { type: "object" },
  sessionId: "ses_recommendations_test",
}

function createConfig(apiKey = "secret", apiUrl = "https://opencode.ai/inference/go/openai/v1") {
  const values: Record<string, string | number> = {
    OPENCODE_GO_API_KEY: apiKey,
    OPENCODE_GO_API_URL: apiUrl,
    OPENCODE_GO_MODEL: "deepseek-v4.1-flash",
    OPENCODE_GO_TIMEOUT_MS: "300000",
  }
  return { get: (key: string) => values[key] } as ConfigService
}

function jsonResponse(value: unknown, status = 200) {
  return new Response(JSON.stringify(value), {
    status,
    headers: { "Content-Type": "application/json" },
  })
}

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe("OpenCodeGoProvider", () => {
  it("requests DeepSeek structured output with the required Go headers", async () => {
    let requestUrl = ""
    let requestInit: RequestInit | undefined
    globalThis.fetch = async (input, init) => {
      requestUrl = String(input)
      requestInit = init
      return jsonResponse({
        choices: [{ message: { content: JSON.stringify({ value: "ok" }) } }],
      })
    }
    const provider = new OpenCodeGoProvider(createConfig())

    const result = await provider.generateStructured({ ...generationArgs, disableReasoning: true })

    assert.deepEqual(result, { value: "ok" })
    assert.equal(requestUrl, "https://opencode.ai/inference/go/openai/v1/chat/completions")
    const headers = new Headers(requestInit?.headers)
    assert.equal(headers.get("Authorization"), "Bearer secret")
    assert.equal(headers.get("User-Agent"), "movie-tracker/1.0")
    assert.equal(headers.get("x-opencode-session"), "ses_recommendations_test")
    const requestBody = JSON.parse(String(requestInit?.body))
    assert.equal(requestBody.model, "deepseek-v4.1-flash")
    assert.equal(requestBody.response_format.type, "json_schema")
    assert.equal(requestBody.response_format.json_schema.strict, true)
    assert.equal(requestBody.reasoning_effort, "low")
    assert.equal(requestBody.stream, false)
  })

  it("accepts a configured URL that already includes the chat completions endpoint", async () => {
    let requestUrl = ""
    globalThis.fetch = async (input) => {
      requestUrl = String(input)
      return jsonResponse({
        choices: [{ message: { content: JSON.stringify({ value: "ok" }) } }],
      })
    }
    const provider = new OpenCodeGoProvider(createConfig(
      "secret",
      "https://opencode.ai/inference/go/openai/v1/chat/completions/",
    ))

    await provider.generateStructured(generationArgs)

    assert.equal(requestUrl, "https://opencode.ai/inference/go/openai/v1/chat/completions")
  })

  it("fails locally when the API key is missing", async () => {
    const provider = new OpenCodeGoProvider(createConfig(""))

    await assert.rejects(provider.generateStructured(generationArgs), AiProviderConfigurationError)
  })

  it("rejects malformed model JSON as an invalid response", async () => {
    globalThis.fetch = async () => jsonResponse({
      choices: [{ message: { content: "not-json" } }],
    })
    const provider = new OpenCodeGoProvider(createConfig())

    await assert.rejects(provider.generateStructured(generationArgs), AiProviderInvalidResponseError)
  })

  it("throws a dedicated empty response error when content is missing", async () => {
    globalThis.fetch = async () => jsonResponse({
      choices: [{ finish_reason: "stop", message: { content: "" } }],
    })
    const provider = new OpenCodeGoProvider(createConfig())

    await assert.rejects(provider.generateStructured(generationArgs), AiProviderEmptyResponseError)
  })

  it("reports when the output budget is exhausted before content is returned", async () => {
    globalThis.fetch = async () => jsonResponse({
      choices: [{ finish_reason: "length", message: { content: "" } }],
    })
    const provider = new OpenCodeGoProvider(createConfig())

    await assert.rejects(
      provider.generateStructured(generationArgs),
      (error) => {
        assert.ok(error instanceof AiProviderTokenLimitError)
        assert.equal(error.details?.finishReason, "length")
        assert.match(error.message, /token budget/)
        return true
      },
    )
  })

  it("reports truncated JSON as a token-limit error", async () => {
    globalThis.fetch = async () => jsonResponse({
      choices: [{ finish_reason: "length", message: { content: "{\"summary\":\"unfinished" } }],
    })
    const provider = new OpenCodeGoProvider(createConfig())

    await assert.rejects(provider.generateStructured(generationArgs), AiProviderTokenLimitError)
  })

  it("passes retryCount to the HTTP client for retryable upstream responses", async () => {
    let requestsCount = 0
    globalThis.fetch = async () => {
      requestsCount++
      if (requestsCount === 1) {
        return jsonResponse({ message: "Temporarily unavailable" }, 503)
      }
      return jsonResponse({
        choices: [{ message: { content: JSON.stringify({ value: "ok" }) } }],
      })
    }
    const provider = new OpenCodeGoProvider(createConfig())

    const result = await provider.generateStructured({ ...generationArgs, retryCount: 1 })

    assert.deepEqual(result, { value: "ok" })
    assert.equal(requestsCount, 2)
  })

  it("maps upstream HTTP failures and preserves the nested OpenCode Go message", async () => {
    globalThis.fetch = async () => jsonResponse({
      error: { message: "The model is unavailable" },
    }, 404)
    const provider = new OpenCodeGoProvider(createConfig())

    await assert.rejects(
      provider.generateStructured(generationArgs),
      (error) => {
        assert.ok(error instanceof AiProviderRequestError)
        assert.equal(error.details?.provider, "opencode-go")
        assert.equal(error.details?.status, 404)
        assert.equal(error.details?.upstreamMessage, "The model is unavailable")
        return true
      },
    )
  })
})
