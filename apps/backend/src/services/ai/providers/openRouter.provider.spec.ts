/* eslint-disable test/no-import-node-test -- Uses the existing Node/ts-node tooling without adding a test framework. */
import assert from "node:assert/strict"
import { afterEach, describe, it } from "node:test"
import { ConfigService } from "@nestjs/config"
import { AiStructuredGenerationArgs } from "@/services/ai/aiProvider.interface"
import { OpenRouterProvider } from "@/services/ai/providers/openRouter.provider"
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
}

function createConfig(apiKey = "secret", apiUrl = "https://openrouter.ai/api/v1") {
  const values: Record<string, string | number> = {
    OPENROUTER_API_KEY: apiKey,
    OPENROUTER_API_URL: apiUrl,
    OPENROUTER_MODEL: "openai/gpt-4o-mini",
    OPENROUTER_TIMEOUT_MS: "60000",
    API_BASE_URL: "http://localhost:1337",
  }
  return { get: (key: string) => values[key] } as ConfigService
}

afterEach(() => {
  globalThis.fetch = originalFetch
})

describe("OpenRouterProvider", () => {
  it("requests strict structured output and parses the JSON content", async () => {
    let requestUrl = ""
    let requestInit: RequestInit | undefined
    globalThis.fetch = async (input, init) => {
      requestUrl = String(input)
      requestInit = init
      return new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({ value: "ok" }) } }],
      }), { status: 200, headers: { "Content-Type": "application/json" } })
    }
    const provider = new OpenRouterProvider(createConfig())

    const result = await provider.generateStructured({ ...generationArgs, disableReasoning: true })

    assert.deepEqual(result, { value: "ok" })
    assert.equal(requestUrl, "https://openrouter.ai/api/v1/chat/completions")
    const headers = new Headers(requestInit?.headers)
    assert.equal(headers.get("Authorization"), "Bearer secret")
    const requestBody = JSON.parse(String(requestInit?.body))
    assert.equal(requestBody.model, "openai/gpt-4o-mini")
    assert.equal(requestBody.response_format.type, "json_schema")
    assert.equal(requestBody.response_format.json_schema.strict, true)
    assert.equal(requestBody.provider.require_parameters, true)
    assert.equal(requestBody.reasoning.enabled, false)
  })

  it("accepts a configured URL that already includes the chat completions endpoint", async () => {
    let requestUrl = ""
    globalThis.fetch = async (input) => {
      requestUrl = String(input)
      return new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({ value: "ok" }) } }],
      }), { status: 200, headers: { "Content-Type": "application/json" } })
    }
    const provider = new OpenRouterProvider(createConfig(
      "secret",
      "https://openrouter.ai/api/v1/chat/completions/",
    ))

    await provider.generateStructured(generationArgs)

    assert.equal(requestUrl, "https://openrouter.ai/api/v1/chat/completions")
  })

  it("fails locally when the API key is missing", async () => {
    const provider = new OpenRouterProvider(createConfig(""))

    await assert.rejects(provider.generateStructured(generationArgs), AiProviderConfigurationError)
  })

  it("rejects malformed model JSON as an invalid response", async () => {
    globalThis.fetch = async () => new Response(JSON.stringify({
      choices: [{ message: { content: "not-json" } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } })
    const provider = new OpenRouterProvider(createConfig())

    await assert.rejects(provider.generateStructured(generationArgs), AiProviderInvalidResponseError)
  })

  it("throws a dedicated empty response error when content is missing", async () => {
    globalThis.fetch = async () => new Response(JSON.stringify({
      choices: [{ finish_reason: "stop", message: { content: "" } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } })
    const provider = new OpenRouterProvider(createConfig())

    await assert.rejects(provider.generateStructured(generationArgs), AiProviderEmptyResponseError)
  })

  it("reports when reasoning consumes the output budget before content is returned", async () => {
    globalThis.fetch = async () => new Response(JSON.stringify({
      choices: [{ finish_reason: "length", message: { content: "" } }],
    }), { status: 200, headers: { "Content-Type": "application/json" } })
    const provider = new OpenRouterProvider(createConfig())

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

  it("passes retryCount to the HTTP client for retryable upstream responses", async () => {
    let requestsCount = 0
    globalThis.fetch = async () => {
      requestsCount++
      if (requestsCount === 1) {
        return new Response(JSON.stringify({ message: "Temporarily unavailable" }), {
          status: 503,
          headers: { "Content-Type": "application/json" },
        })
      }
      return new Response(JSON.stringify({
        choices: [{ message: { content: JSON.stringify({ value: "ok" }) } }],
      }), { status: 200, headers: { "Content-Type": "application/json" } })
    }
    const provider = new OpenRouterProvider(createConfig())

    const result = await provider.generateStructured({ ...generationArgs, retryCount: 1 })

    assert.deepEqual(result, { value: "ok" })
    assert.equal(requestsCount, 2)
  })

  it("maps upstream HTTP failures and preserves the nested OpenRouter message", async () => {
    globalThis.fetch = async () => new Response(JSON.stringify({
      error: { message: "No endpoints found that support structured outputs" },
    }), {
      status: 404,
      headers: { "Content-Type": "application/json" },
    })
    const provider = new OpenRouterProvider(createConfig())

    await assert.rejects(
      provider.generateStructured(generationArgs),
      (error) => {
        assert.ok(error instanceof AiProviderRequestError)
        assert.equal(error.details?.status, 404)
        assert.equal(error.details?.upstreamMessage, "No endpoints found that support structured outputs")
        return true
      },
    )
  })
})
