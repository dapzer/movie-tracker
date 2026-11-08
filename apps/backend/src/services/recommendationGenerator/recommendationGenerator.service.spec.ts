/* eslint-disable test/no-import-node-test -- Uses the existing Node/ts-node tooling without adding a test framework. */
import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { MediaTypeEnum, RecommendationInputItemType, RecommendationItemType } from "@movie-tracker/types"
import { AiService } from "@/services/ai/ai.service"
import { AiStructuredClientInterface } from "@/services/ai/aiProvider.interface"
import { RecommendationGeneratorService } from "@/services/recommendationGenerator/recommendationGenerator.service"
import { AiProviderInvalidResponseError, AiProviderTokenLimitError } from "@/shared/errors/ai"

const sourceItems = [{
  title: "Fight Club",
  releaseYear: 1999,
  mediaType: MediaTypeEnum.MOVIE,
  rating: 9,
  review: "Great atmosphere and memorable ending.",
  note: "I want something unconventional.",
}]

function recommendation(overrides: Partial<RecommendationItemType> = {}): RecommendationItemType {
  return {
    title: "Oldboy",
    releaseYear: 2003,
    mediaType: MediaTypeEnum.MOVIE,
    reason: "Intense and unconventional.",
    ...overrides,
  }
}

function createProvider(
  responses: Array<unknown | Error>,
  calls: Array<Record<string, unknown>> = [],
  summaryResponses: Array<unknown | Error> = [],
) {
  let call = 0
  let summaryCall = 0
  const provider: AiStructuredClientInterface = {
    generateStructured: async (args) => {
      calls.push(args as unknown as Record<string, unknown>)
      if (args.schemaName === "media_taste_summary") {
        const response = summaryResponses.length
          ? summaryResponses[summaryCall++]
          : { summary: "Test taste profile covering every source item." }
        if (response instanceof Error) {
          throw response
        }
        return response
      }
      const response = responses[call++]
      if (response instanceof Error) {
        throw response
      }
      return response
    },
  }
  return provider as unknown as AiService
}

describe("RecommendationGeneratorService", () => {
  it("accepts mixed movie and TV recommendations and includes taste signals in the prompt", async () => {
    const calls: Array<Record<string, unknown>> = []
    const previousRecommendations = [recommendation({ title: "Dark", mediaType: MediaTypeEnum.TV, releaseYear: 2017 })]
    const expected = [
      recommendation(),
      recommendation({ title: "Severance", mediaType: MediaTypeEnum.TV, releaseYear: 2022 }),
    ]
    const provider = createProvider([{ recommendations: expected }], calls)
    const service = new RecommendationGeneratorService(provider)

    const result = await service.generate({ items: sourceItems, count: 2, previousRecommendations })

    assert.deepEqual(result, expected)
    const summaryCall = calls.find(call => call.schemaName === "media_taste_summary")
    const generationCall = calls.find(call => call.schemaName === "media_recommendations")
    assert.equal(generationCall?.disableReasoning, true)
    assert.equal(generationCall?.retryCount, 1)
    assert.equal(summaryCall?.retryCount, 1)
    assert.equal(summaryCall?.maxTokens, 4000)
    assert.equal(generationCall?.maxTokens, 2720)
    assert.match(String(generationCall?.sessionId), /^ses_/)
    assert.equal(summaryCall?.sessionId, generationCall?.sessionId)
    const summaryPrompt = String(summaryCall?.userPrompt)
    assert.match(summaryPrompt, /Great atmosphere and memorable ending/)
    assert.match(summaryPrompt, /I want something unconventional/)
    assert.match(summaryPrompt, /"rating":9/)
    assert.match(String(generationCall?.userPrompt), /Test taste profile covering every source item/)
    assert.match(String(generationCall?.userPrompt), /Previous recommendations to exclude/)
    const schema = generationCall?.schema as {
      properties: {
        recommendations: {
          minItems: number
          maxItems: number
          items: { properties: { mediaType: { enum: string[] } } }
        }
      }
    }
    assert.equal(schema.properties.recommendations.minItems, 2)
    assert.equal(schema.properties.recommendations.maxItems, 4)
    assert.deepEqual(schema.properties.recommendations.items.properties.mediaType.enum, ["movie", "tv"])
  })

  it("supports requesting 24 recommendations", async () => {
    const calls: Array<Record<string, unknown>> = []
    const expected = Array.from({ length: 24 }, (_, index) => recommendation({
      title: `Recommendation ${index + 1}`,
      releaseYear: 2000 + index,
    }))
    const service = new RecommendationGeneratorService(createProvider([{ recommendations: expected }], calls))

    const result = await service.generate({ items: sourceItems, count: 24 })

    assert.equal(result.length, 24)
    assert.deepEqual(result, expected)
  })

  it("allows the same title and year for different media types", async () => {
    const expected = [
      recommendation({ title: "The Office", releaseYear: 2005, mediaType: MediaTypeEnum.MOVIE }),
      recommendation({ title: "The Office", releaseYear: 2005, mediaType: MediaTypeEnum.TV }),
    ]
    const service = new RecommendationGeneratorService(createProvider([{ recommendations: expected }]))

    const result = await service.generate({ items: sourceItems, count: 2 })

    assert.deepEqual(result, expected)
  })

  it("filters excluded candidates from an oversized pool and returns the requested count", async () => {
    const previousRecommendations = [recommendation()]
    const valid = [
      recommendation({ title: "Parasite", releaseYear: 2019 }),
      recommendation({ title: "Dark", releaseYear: 2017, mediaType: MediaTypeEnum.TV }),
    ]
    const provider = createProvider([{
      recommendations: [
        recommendation({ title: "Fight Club", releaseYear: 1999 }),
        recommendation(),
        ...valid,
      ],
    }])
    const service = new RecommendationGeneratorService(provider)

    const result = await service.generate({ items: sourceItems, count: 2, previousRecommendations })

    assert.deepEqual(result, valid)
  })

  it("retries when results contain source items or previous recommendations", async () => {
    const previousRecommendations = [recommendation()]
    const valid = [
      recommendation({ title: "Parasite", releaseYear: 2019 }),
      recommendation({ title: "Dark", releaseYear: 2017, mediaType: MediaTypeEnum.TV }),
    ]
    const provider = createProvider([
      {
        recommendations: [
          recommendation(),
          recommendation({ title: "Fight  Club", releaseYear: 2001 }),
        ],
      },
      { recommendations: valid },
    ])
    const service = new RecommendationGeneratorService(provider)

    const result = await service.generate({ items: sourceItems, count: 2, previousRecommendations })

    assert.deepEqual(result, valid)
  })

  it("retries an invalid provider response", async () => {
    const valid = [recommendation()]
    const provider = createProvider([
      new AiProviderInvalidResponseError(),
      { recommendations: valid },
    ])
    const service = new RecommendationGeneratorService(provider)

    const result = await service.generate({ items: sourceItems, count: 1 })

    assert.deepEqual(result, valid)
  })

  it("retries token exhaustion with the same candidate count and a larger budget", async () => {
    const calls: Array<Record<string, unknown>> = []
    const valid = [recommendation()]
    const provider = createProvider([
      new AiProviderTokenLimitError(),
      { recommendations: valid },
    ], calls)
    const service = new RecommendationGeneratorService(provider)

    const result = await service.generate({ items: sourceItems, count: 1 })

    assert.deepEqual(result, valid)
    const generationCalls = calls.filter(call => call.schemaName === "media_recommendations")
    assert.equal(generationCalls.length, 2)
    assert.equal(generationCalls[0].maxTokens, 2360)
    assert.equal(generationCalls[1].maxTokens, 4720)
    assert.match(String(generationCalls[0].userPrompt), /Generate exactly 2 new recommendations/)
    assert.match(String(generationCalls[1].userPrompt), /Generate exactly 2 new recommendations/)
  })

  it("retries a malformed chunk summary before generating recommendations", async () => {
    const calls: Array<Record<string, unknown>> = []
    const expected = [recommendation()]
    const provider = createProvider(
      [{ recommendations: expected }],
      calls,
      [{ invalid: true }, { summary: "Recovered taste profile." }],
    )
    const service = new RecommendationGeneratorService(provider)

    const result = await service.generate({ items: sourceItems, count: 1 })

    assert.deepEqual(result, expected)
    const summaryCalls = calls.filter(call => call.schemaName === "media_taste_summary")
    assert.deepEqual(summaryCalls.map(call => call.maxTokens), [4000, 8000])
  })

  it("includes every item once across detailed chunk prompts", async () => {
    const items: RecommendationInputItemType[] = Array.from({ length: 205 }, (_, index) => ({
      title: `Item ${index}`,
      releaseYear: 2000,
      mediaType: MediaTypeEnum.MOVIE,
      ...(index === 204 ? { rating: 10 } : {}),
    }))
    const calls: Array<Record<string, unknown>> = []
    const expected = recommendation({ title: "New recommendation" })
    const provider = createProvider([{ recommendations: [expected] }], calls)
    const service = new RecommendationGeneratorService(provider)

    const result = await service.generate({ items, count: 1 })

    assert.deepEqual(result, [expected])
    const chunkItems = calls
      .filter(call => call.schemaName === "media_taste_summary")
      .map(call => JSON.parse(
        String(call.userPrompt).split("Complete chunk items (JSON data):\n")[1],
      ) as RecommendationInputItemType[])
    assert.deepEqual(chunkItems.map(chunk => chunk.length).sort((a, b) => a - b), [5, 100, 100])
    assert.deepEqual(
      chunkItems.flatMap(chunk => chunk.map(item => item.title)).sort(),
      items.map(item => item.title).sort(),
    )
    assert.match(
      calls.map(call => String(call.userPrompt)).join("\n"),
      /"rating":10/,
    )
  })

  it("fails without returning partial results after repeated invalid output", async () => {
    const provider = createProvider([
      { recommendations: [recommendation()] },
      { recommendations: [recommendation()] },
    ])
    const service = new RecommendationGeneratorService(provider)
    const previousRecommendations = [recommendation()]

    await assert.rejects(
      service.generate({ items: sourceItems, count: 1, previousRecommendations }),
      AiProviderInvalidResponseError,
    )
  })
})
