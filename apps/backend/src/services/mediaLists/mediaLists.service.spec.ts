/* eslint-disable test/no-import-node-test -- Uses the existing Node/ts-node tooling without adding a test framework. */
import assert from "node:assert/strict"
import { describe, it } from "node:test"
import {
  MediaItemTrackingDataType,
  MediaItemType,
  MediaListType,
  MediaRatingType,
  MediaReview,
  MediaTypeEnum,
  RecommendationInputItemType,
} from "@movie-tracker/types"
import { MediaListsService } from "@/services/mediaLists/mediaLists.service"
import { RecommendationsService } from "@/services/recommendations/recommendations.service"
import { BadArgumentsError } from "@/shared/errors/core"
import { MediaListUnauthorizedError } from "@/shared/errors/mediaList"

const userId = "7e390f1e-b40d-4d0c-938f-cde5137ea995"
const mediaListId = "6a1baef2-fc36-4f9b-9364-c5b1723a57a4"
const sessionId = "f706fb7d-53ea-4b6a-a541-92d19ab5de30"

function createHarness(options: { empty?: boolean, ownerId?: string } = {}) {
  const mediaList = { id: mediaListId, userId: options.ownerId ?? userId } as MediaListType
  const mediaItems = options.empty
    ? []
    : [
        {
          id: "movie-item",
          mediaId: 1,
          mediaType: MediaTypeEnum.MOVIE,
          mediaDetails: {
            releaseDate: "1999-10-15",
            en: { title: "Fight Club", originalTitle: "Fight Club" },
            ru: { title: "Бойцовский клуб", originalTitle: "Fight Club" },
          },
        },
        {
          id: "tv-item",
          mediaId: 1,
          mediaType: MediaTypeEnum.TV,
          mediaDetails: {
            releaseDate: "2017-12-01",
            en: { title: "Dark", originalTitle: "Dark" },
            ru: { title: "Тьма", originalTitle: "Dark" },
          },
        },
      ] as MediaItemType[]
  const ratings = [
    { mediaId: 1, mediaType: MediaTypeEnum.MOVIE, rating: 9 },
    { mediaId: 1, mediaType: MediaTypeEnum.TV, rating: 8 },
  ] as MediaRatingType[]
  const reviews = [
    { mediaId: 1, mediaType: MediaTypeEnum.MOVIE, content: "Unconventional and intense." },
    { mediaId: 1, mediaType: MediaTypeEnum.TV, content: "Complex mystery." },
  ] as MediaReview[]
  const tracking = [
    { mediaItemId: "movie-item", note: "More psychological stories." },
    { mediaItemId: "tv-item", note: "Prefer complete series." },
  ] as MediaItemTrackingDataType[]
  const calls: Array<{ type: string, args: { body: { items: RecommendationInputItemType[] } } }> = []
  const recommendationsService = {
    create: async (args) => {
      calls.push({ type: "create", args })
      return { sessionId, recommendations: [] }
    },
    refresh: async (args) => {
      calls.push({ type: "refresh", args })
      return { sessionId, recommendations: [] }
    },
  } as unknown as RecommendationsService
  const service = new MediaListsService(
    { getById: async () => mediaList } as never,
    { getByListId: async () => ({ items: mediaItems, totalCount: mediaItems.length }) } as never,
    { getByUserIdAndMediaIds: async () => ratings } as never,
    { getByUserIdAndMediaIds: async () => reviews } as never,
    { getByMediaItemIds: async () => tracking } as never,
    {} as never,
    {} as never,
    {} as never,
    {} as never,
    recommendationsService,
  )
  return { service, calls }
}

describe("MediaListsService recommendations", () => {
  it("joins item details, ratings, review text, and notes by media type and item", async () => {
    const { service, calls } = createHarness()

    const result = await service.generateRecommendations({ mediaListId, userId, count: 5 })

    assert.equal(result.sessionId, sessionId)
    assert.equal(calls[0]?.type, "create")
    assert.deepEqual(calls[0]?.args.body.items, [
      {
        title: "Fight Club",
        originalTitle: "Fight Club",
        releaseYear: 1999,
        mediaType: MediaTypeEnum.MOVIE,
        rating: 9,
        review: "Unconventional and intense.",
        note: "More psychological stories.",
      },
      {
        title: "Dark",
        originalTitle: "Dark",
        releaseYear: 2017,
        mediaType: MediaTypeEnum.TV,
        rating: 8,
        review: "Complex mystery.",
        note: "Prefer complete series.",
      },
    ])
  })

  it("refreshes an existing session using the current list data", async () => {
    const { service, calls } = createHarness()

    await service.generateRecommendations({ mediaListId, userId, count: 5, sessionId })

    assert.equal(calls.length, 1)
    assert.equal(calls[0]?.type, "refresh")
    assert.equal(calls[0]?.args.body.items.length, 2)
  })

  it("allows only the media list owner to generate recommendations", async () => {
    const { service, calls } = createHarness({ ownerId: "another-user" })

    await assert.rejects(
      service.generateRecommendations({ mediaListId, userId, count: 5 }),
      MediaListUnauthorizedError,
    )
    assert.equal(calls.length, 0)
  })

  it("rejects an empty media list", async () => {
    const { service, calls } = createHarness({ empty: true })

    await assert.rejects(
      service.generateRecommendations({ mediaListId, userId, count: 5 }),
      BadArgumentsError,
    )
    assert.equal(calls.length, 0)
  })
})
