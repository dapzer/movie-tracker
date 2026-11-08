/* eslint-disable test/no-import-node-test -- Uses the existing Node/ts-node tooling without adding a test framework. */
import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { ConfigService } from "@nestjs/config"
import { AiService } from "@/services/ai/ai.service"
import {
  AiProviderInterface,
  AiStructuredGenerationArgs,
} from "@/services/ai/aiProvider.interface"
import { AiProviderConfigurationError } from "@/shared/errors/ai"

const generationArgs: AiStructuredGenerationArgs = {
  systemPrompt: "System prompt",
  userPrompt: "User prompt",
  schemaName: "structured_response",
  schema: { type: "object" },
}

function createConfig(provider = "openrouter") {
  return { get: (key: string) => key === "AI_PROVIDER" ? provider : undefined } as ConfigService
}

describe("AiService", () => {
  it("delegates structured generation to the configured provider", async () => {
    let receivedArgs: AiStructuredGenerationArgs | undefined
    const provider: AiProviderInterface = {
      name: "openrouter",
      generateStructured: async (args) => {
        receivedArgs = args
        return { result: "ok" }
      },
    }
    const service = new AiService([provider], createConfig())

    const result = await service.generateStructured(generationArgs)

    assert.deepEqual(result, { result: "ok" })
    assert.equal(receivedArgs, generationArgs)
  })

  it("rejects a provider that is not registered", async () => {
    const provider: AiProviderInterface = {
      name: "openrouter",
      generateStructured: async () => ({}),
    }
    const service = new AiService([provider], createConfig("another-provider"))

    await assert.rejects(service.generateStructured(generationArgs), AiProviderConfigurationError)
  })
})
