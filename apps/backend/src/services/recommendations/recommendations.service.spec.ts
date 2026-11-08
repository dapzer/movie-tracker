/* eslint-disable test/no-import-node-test -- Uses the existing Node/ts-node tooling without adding a test framework. */
import assert from "node:assert/strict"
import { describe, it } from "node:test"
import { MediaDetailsType, MediaTypeEnum, RecommendationItemType } from "@movie-tracker/types"
import { RecommendationRepositoryInterface } from "@/repositories/recommendation/RecommendationRepositoryInterface"
import { RecommendationGeneratorService } from "@/services/recommendationGenerator/recommendationGenerator.service"
import { GenerateRecommendationsDto } from "@/services/recommendations/dto/generateRecommendations.dto"
import { RecommendationsService } from "@/services/recommendations/recommendations.service"
import { RecommendationSessionNotFoundError } from "@/shared/errors/recommendation"
import { TmdbNotFoundError } from "@/shared/errors/tmdb"

const userId = "7e390f1e-b40d-4d0c-938f-cde5137ea995"
const sessionId = "f706fb7d-53ea-4b6a-a541-92d19ab5de30"
const body = {
  items: [{ title: "Fight Club", mediaType: MediaTypeEnum.MOVIE }],
  count: 1,
} as GenerateRecommendationsDto
const generatedRecommendation: RecommendationItemType = {
  title: "Dark",
  releaseYear: 2017,
  mediaType: MediaTypeEnum.TV,
  reason: "Complex mystery and unconventional storytelling.",
}

function createHarness(overrides: Partial<RecommendationRepositoryInterface> = {}, failDatedResolution = false) {
  const repositoryCalls = {
    createSession: 0,
    addRecommendations: 0,
  }
  const repository: RecommendationRepositoryInterface = {
    createSession: async () => {
      repositoryCalls.createSession++
      return { id: sessionId, userId, createdAt: new Date(), updatedAt: new Date() }
    },
    getSessionByIdAndUserId: async () => ({ id: sessionId, userId, createdAt: new Date(), updatedAt: new Date() }),
    getRecommendationsBySessionId: async () => [],
    addRecommendations: async (args) => {
      repositoryCalls.addRecommendations++
      return args.recommendations.map(item => ({
        ...item,
        id: "00320f1a-24b6-4e66-98c1-2d590dce9b32",
        sessionId: args.sessionId,
        mediaId: item.mediaDetails.mediaId,
        mediaDetailsId: item.mediaDetails.id,
        createdAt: new Date(),
      }))
    },
    ...overrides,
  }
  const generator: { generate: RecommendationGeneratorService["generate"] } = {
    generate: async () => [generatedRecommendation],
  }
  const mediaDetails = { id: "details-id", mediaId: 123, mediaType: MediaTypeEnum.TV } as MediaDetailsType
  const resolutionCalls: unknown[] = []
  const detailsCalls: unknown[] = []
  const tmdbResolver = {
    findByTitleAndReleaseDate: async (args) => {
      resolutionCalls.push(args)
      if (failDatedResolution && args.year !== undefined) {
        throw new TmdbNotFoundError()
      }
      return { id: 123, type: MediaTypeEnum.TV, releaseDate: "2017-12-01" }
    },
  }
  const mediaDetailsService = {
    createOrUpdate: async (args) => {
      detailsCalls.push(args)
      return mediaDetails
    },
  }
  const drizzle = { runInTransaction: async (fn: () => Promise<unknown>) => fn() }
  const redlock = { using: async (_key: string, fn: () => Promise<unknown>) => fn() }
  const service = new RecommendationsService(
    repository,
    generator as never,
    tmdbResolver as never,
    mediaDetailsService as never,
    drizzle as never,
    redlock as never,
  )
  return { service, repositoryCalls, generator, mediaDetails, resolutionCalls, detailsCalls }
}

describe("RecommendationsService", () => {
  it("creates a session, enriches recommendations, and saves the first batch", async () => {
    const { service, repositoryCalls, mediaDetails, resolutionCalls, detailsCalls } = createHarness()

    const result = await service.create({ userId, body })

    assert.equal(result.sessionId, sessionId)
    assert.deepEqual(result.recommendations, [{ ...generatedRecommendation, mediaDetails }])
    assert.deepEqual(resolutionCalls, [{ title: "Dark", year: 2017, type: MediaTypeEnum.TV }])
    assert.deepEqual(detailsCalls, [{
      mediaId: 123,
      mediaType: MediaTypeEnum.TV,
      currentDetails: null,
      skipError: false,
    }])
    assert.equal(repositoryCalls.createSession, 1)
    assert.equal(repositoryCalls.addRecommendations, 1)
  })

  it("retries TMDB resolution without an inaccurate AI-provided year", async () => {
    const { service, mediaDetails, resolutionCalls } = createHarness({}, true)

    const result = await service.create({ userId, body })

    assert.deepEqual(result.recommendations, [{ ...generatedRecommendation, mediaDetails }])
    assert.deepEqual(resolutionCalls, [
      { title: "Dark", year: 2017, type: MediaTypeEnum.TV },
      { title: "Dark", type: MediaTypeEnum.TV },
    ])
  })

  it("passes stored history to generation and appends a refreshed batch", async () => {
    let receivedPreviousRecommendations: RecommendationItemType[] | undefined
    const previousRecommendation = {
      ...generatedRecommendation,
      id: "8598f1af-07f2-4bfa-8be2-37f8a2c42250",
      sessionId,
      mediaId: 123,
      mediaDetailsId: "details-id",
      createdAt: new Date(),
    }
    const { service, repositoryCalls, generator } = createHarness({
      getRecommendationsBySessionId: async () => [previousRecommendation],
    })
    generator.generate = async (args) => {
      receivedPreviousRecommendations = args.previousRecommendations
      return [generatedRecommendation]
    }

    const result = await service.refresh({ sessionId, userId, body })

    assert.equal(result.sessionId, sessionId)
    assert.deepEqual(receivedPreviousRecommendations, [previousRecommendation])
    assert.equal(repositoryCalls.addRecommendations, 1)
  })

  it("does not generate recommendations for a missing or inaccessible session", async () => {
    let generated = false
    const { service, generator } = createHarness({
      getSessionByIdAndUserId: async () => undefined,
    })
    generator.generate = async () => {
      generated = true
      return [generatedRecommendation]
    }

    await assert.rejects(
      service.refresh({ sessionId, userId, body }),
      RecommendationSessionNotFoundError,
    )
    assert.equal(generated, false)
  })

  it("does not create a session when generation fails", async () => {
    const { service, repositoryCalls, generator } = createHarness()
    generator.generate = async () => {
      throw new Error("Provider failed")
    }

    await assert.rejects(service.create({ userId, body }), /Provider failed/)
    assert.equal(repositoryCalls.createSession, 0)
    assert.equal(repositoryCalls.addRecommendations, 0)
  })
})
