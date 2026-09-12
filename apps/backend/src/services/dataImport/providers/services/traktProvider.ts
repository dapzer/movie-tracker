import {
  DataImportBucketType,
  DataImportEpisodeProgressType,
  DataImportListType,
  DataImportMediaType,
  DataImportRatingType,
  DataImportRawResultType,
  DataImportReviewType,
  DataImportSourceEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { z } from "zod"
import {
  traktCommentMovieItemSchema,
  traktCommentShowItemSchema,
  traktCustomListItemSchema,
  traktCustomListMetadataSchema,
  traktFavoritesItemSchema,
  traktRatingMovieItemSchema,
  traktRatingShowItemSchema,
  traktWatchedHistoryEpisodeItemSchema,
  traktWatchedMovieItemSchema,
  traktWatchedShowItemSchema,
  traktWatchlistItemSchema,
} from "@/services/dataImport/dto/traktRaw.dto"
import { BaseService } from "@/services/dataImport/providers/services/base/base"
import { TmdbResolver } from "@/services/dataImport/providers/services/base/tmdbResolver"
import { SourceFileMissingError } from "@/shared/errors/dataImport"

const CUSTOM_LIST_FILE_NAME_PATTERN = /^lists-list-\d+-.+\.json$/

interface TraktIds {
  trakt: number
  imdb?: string
  tmdb?: number
  tvdb?: number
}

interface TraktMediaRef {
  ids: TraktIds
  title: string
  year?: number
}

interface TraktShowHistory {
  show: TraktMediaRef
  episodes: DataImportEpisodeProgressType[]
}

type TraktEpisodesHistoryByShow = Map<number, TraktShowHistory>

@Injectable()
export class TraktProvider extends BaseService {
  constructor(
    tmdbResolver: TmdbResolver,
  ) {
    super(DataImportSourceEnum.TRAKT, tmdbResolver)
  }

  get requiredFiles(): string[] {
    return [
      "watched-movies.json",
      "watched-shows.json",
      "watched-history.json",
      "lists-watchlist.json",
      "ratings-movies.json",
      "ratings-shows.json",
      "comments-movies.json",
      "comments-shows.json",
      "lists-lists.json",
      "lists-favorites.json",
    ]
  }

  async import(args: { files: Map<string, string> }): Promise<DataImportRawResultType> {
    const episodesHistoryByShow = this.groupEpisodesHistoryByShow({ files: args.files })

    const [watched, watchList, ratings, reviews, lists] = await Promise.all([
      this.importWatched({ files: args.files, episodesHistoryByShow }),
      this.importWatchlist({ files: args.files, episodesHistoryByShow }),
      this.importRatings({ files: args.files }),
      this.importReviews({ files: args.files }),
      this.importLists({ files: args.files, episodesHistoryByShow }),
    ])

    return {
      watched,
      watchList,
      ratings,
      reviews,
      lists,
      notes: { success: [], failed: [] },
    }
  }

  private createBucket<T>(): DataImportBucketType<T> {
    return { success: [], failed: [] }
  }

  private parseFile<T extends z.ZodType>(args: { files: Map<string, string>, fileName: string, schema: T }) {
    const content = args.files.get(args.fileName)

    if (!content) {
      throw new SourceFileMissingError({ fileName: args.fileName })
    }

    const parsedJson = this.convertStringToJson({ content, fileName: args.fileName })
    const json = Array.isArray(parsedJson) ? parsedJson : [parsedJson]

    return this.safeParseJson({ json, schema: args.schema })
  }

  private async toMedia(args: { media: TraktMediaRef, type: "movie" | "tv" }): Promise<DataImportMediaType> {
    const resolved = await this.resolveMedia({
      tmdbId: args.media.ids.tmdb,
      imdbId: args.media.ids.imdb,
      tvdbId: args.type === "tv" ? args.media.ids.tvdb : undefined,
      title: args.media.title,
      year: args.media.year,
      type: args.type,
    })

    return {
      ...resolved,
      title: args.media.title,
      ids: {
        ...resolved.ids,
        traktId: args.media.ids.trakt,
      },
    }
  }

  private groupEpisodesHistoryByShow(args: { files: Map<string, string> }): TraktEpisodesHistoryByShow {
    const historyEpisodes = this.parseFile({ files: args.files, fileName: "watched-history.json", schema: traktWatchedHistoryEpisodeItemSchema })
    const episodesHistoryByShow: TraktEpisodesHistoryByShow = new Map()

    for (const record of historyEpisodes.success) {
      const traktId = record.show.ids.trakt
      const episode: DataImportEpisodeProgressType = {
        status: "watched",
        seasonNumber: record.episode.season,
        episodeNumber: record.episode.number,
        watchedAt: record.watched_at,
      }

      const existingEntry = episodesHistoryByShow.get(traktId)

      if (existingEntry) {
        existingEntry.episodes.push(episode)
      }
      else {
        episodesHistoryByShow.set(traktId, { show: record.show, episodes: [episode] })
      }
    }

    return episodesHistoryByShow
  }

  private async importWatched(args: { files: Map<string, string>, episodesHistoryByShow: TraktEpisodesHistoryByShow }): Promise<DataImportBucketType<DataImportMediaType>> {
    const movies = this.parseFile({ files: args.files, fileName: "watched-movies.json", schema: traktWatchedMovieItemSchema })
    const shows = this.parseFile({ files: args.files, fileName: "watched-shows.json", schema: traktWatchedShowItemSchema })

    const bucket = this.createBucket<DataImportMediaType>()
    const showProgress = new Map<number, DataImportMediaType>()

    const showsResults = await this.processRecords({
      records: shows.success,
      process: async (record) => {
        const media = await this.toMedia({ media: record.show, type: "tv" })
        media.createdAt = record.last_watched_at
        media.episodesProgress = args.episodesHistoryByShow.get(record.show.ids.trakt)?.episodes ?? []
        return { traktId: record.show.ids.trakt, media }
      },
    })

    for (const result of showsResults) {
      if ("value" in result) {
        showProgress.set(result.value.traktId, result.value.media)
      }
      else {
        bucket.failed.push(result.failure)
      }
    }

    const historyOnlyShows = [...args.episodesHistoryByShow.values()].filter(entry => !showProgress.has(entry.show.ids.trakt))

    const historyResults = await this.processRecords({
      records: historyOnlyShows,
      process: async (entry) => {
        const media = await this.toMedia({ media: entry.show, type: "tv" })
        media.createdAt = entry.episodes.reduce<DataImportEpisodeProgressType["watchedAt"]>((latest, episode) => {
          if (episode.watchedAt && (!latest || episode.watchedAt > latest)) {
            return episode.watchedAt
          }

          return latest
        }, undefined)
        media.episodesProgress = entry.episodes
        return { traktId: entry.show.ids.trakt, media }
      },
    })

    for (const result of historyResults) {
      if ("value" in result) {
        showProgress.set(result.value.traktId, result.value.media)
      }
      else {
        bucket.failed.push(result.failure)
      }
    }

    const moviesResults = await this.processRecords({
      records: movies.success,
      process: async (record) => {
        const media = await this.toMedia({ media: record.movie, type: "movie" })
        media.createdAt = record.last_watched_at
        return media
      },
    })

    for (const result of moviesResults) {
      if ("value" in result) {
        bucket.success.push(result.value)
      }
      else {
        bucket.failed.push(result.failure)
      }
    }

    bucket.success.push(...showProgress.values())
    bucket.failed.push(...movies.failed, ...shows.failed)

    return bucket
  }

  private async processListItem(args: { record: z.infer<typeof traktCustomListItemSchema>, episodesHistoryByShow: TraktEpisodesHistoryByShow }): Promise<DataImportMediaType> {
    const ref = args.record.type === "movie" ? args.record.movie : args.record.show
    const media = await this.toMedia({ media: ref, type: args.record.type === "movie" ? "movie" : "tv" })
    media.createdAt = args.record.listed_at
    media.note = args.record.notes ?? undefined

    if (args.record.type === "show") {
      media.episodesProgress = args.episodesHistoryByShow.get(args.record.show.ids.trakt)?.episodes
    }

    return media
  }

  private async importWatchlist(args: { files: Map<string, string>, episodesHistoryByShow: TraktEpisodesHistoryByShow }): Promise<DataImportBucketType<DataImportMediaType>> {
    const parsed = this.parseFile({ files: args.files, fileName: "lists-watchlist.json", schema: traktWatchlistItemSchema })
    const bucket = await this.processToBucket({
      records: parsed.success,
      process: record => this.processListItem({ record, episodesHistoryByShow: args.episodesHistoryByShow }),
    })

    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async importRatings(args: { files: Map<string, string> }): Promise<DataImportBucketType<DataImportRatingType>> {
    const movies = this.parseFile({ files: args.files, fileName: "ratings-movies.json", schema: traktRatingMovieItemSchema })
    const shows = this.parseFile({ files: args.files, fileName: "ratings-shows.json", schema: traktRatingShowItemSchema })
    const bucket = this.createBucket<DataImportRatingType>()

    const [moviesResults, showsResults] = await Promise.all([
      this.processRecords({
        records: movies.success,
        process: async (record) => {
          const media = await this.toMedia({ media: record.movie, type: "movie" })
          return { media, value: record.rating, createdAt: record.rated_at }
        },
      }),
      this.processRecords({
        records: shows.success,
        process: async (record) => {
          const media = await this.toMedia({ media: record.show, type: "tv" })
          return { media, value: record.rating, createdAt: record.rated_at }
        },
      }),
    ])

    for (const result of [...moviesResults, ...showsResults]) {
      if ("value" in result) {
        bucket.success.push(result.value)
      }
      else {
        bucket.failed.push(result.failure)
      }
    }

    bucket.failed.push(...movies.failed, ...shows.failed)

    return bucket
  }

  private async importReviews(args: { files: Map<string, string> }): Promise<DataImportBucketType<DataImportReviewType>> {
    const movies = this.parseFile({ files: args.files, fileName: "comments-movies.json", schema: traktCommentMovieItemSchema })
    const shows = this.parseFile({ files: args.files, fileName: "comments-shows.json", schema: traktCommentShowItemSchema })

    const records = [
      ...movies.success.map(record => ({ ...record, ref: record.movie, mediaType: "movie" as const })),
      ...shows.success.map(record => ({ ...record, ref: record.show, mediaType: "tv" as const })),
    ]

    const bucket = await this.processToBucket({
      records,
      process: async (record) => {
        const media = await this.toMedia({ media: record.ref, type: record.mediaType })
        return {
          media,
          content: record.comment.comment,
          createdAt: record.comment.created_at,
          updatedAt: record.comment.updated_at,
          rate: record.comment.user_rating ?? undefined,
          isSpoiler: record.comment.spoiler,
        }
      },
    })

    bucket.failed.push(...movies.failed, ...shows.failed)

    return bucket
  }

  private async importLists(args: { files: Map<string, string>, episodesHistoryByShow: TraktEpisodesHistoryByShow }): Promise<DataImportBucketType<DataImportListType>> {
    const bucket = this.createBucket<DataImportListType>()

    const parsedListsMetadata = this.parseFile({ files: args.files, fileName: "lists-lists.json", schema: traktCustomListMetadataSchema })
    bucket.failed.push(...parsedListsMetadata.failed)

    for (const listMetadata of parsedListsMetadata.success) {
      try {
        const itemsFileName = [...args.files.keys()].find(fileName =>
          CUSTOM_LIST_FILE_NAME_PATTERN.test(fileName) && fileName.startsWith(`lists-list-${listMetadata.ids.trakt}-`),
        )
        const itemsFileContent = itemsFileName ? args.files.get(itemsFileName) : null

        const items: DataImportBucketType<DataImportMediaType> = this.createBucket<DataImportMediaType>()

        if (itemsFileContent && itemsFileName) {
          const parsedItemsJson = this.convertStringToJson({ content: itemsFileContent, fileName: itemsFileName })
          const itemsJson = Array.isArray(parsedItemsJson) ? parsedItemsJson : [parsedItemsJson]
          const parsedItems = this.safeParseJson({ json: itemsJson, schema: traktCustomListItemSchema })

          const itemsBucket = await this.processToBucket({
            records: parsedItems.success,
            process: record => this.processListItem({ record, episodesHistoryByShow: args.episodesHistoryByShow }),
          })

          items.success.push(...itemsBucket.success)
          items.failed.push(...itemsBucket.failed, ...parsedItems.failed)
        }

        bucket.success.push({
          id: String(listMetadata.ids.trakt),
          title: listMetadata.name,
          description: listMetadata.description || undefined,
          isPrivate: listMetadata.privacy !== "public",
          createdAt: listMetadata.created_at,
          updatedAt: listMetadata.updated_at,
          items,
        })
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: listMetadata }))
      }
    }

    const favorites = this.parseFile({ files: args.files, fileName: "lists-favorites.json", schema: traktFavoritesItemSchema })
    bucket.failed.push(...favorites.failed)
    if (favorites.success.length) {
      const items = await this.processToBucket({
        records: favorites.success,
        process: record => this.processListItem({ record, episodesHistoryByShow: args.episodesHistoryByShow }),
      })

      items.failed.push(...favorites.failed)

      bucket.success.push({
        id: "favorites",
        title: "Favorites",
        isPrivate: true,
        items,
      })
    }

    return bucket
  }
}
