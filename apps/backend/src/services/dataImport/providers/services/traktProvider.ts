import { Injectable } from "@nestjs/common"
import { z } from "zod"
import {
  Failure,
  ImportBucket,
  ImportRawResult,
  List,
  Media,
  Rating,
  Review,
} from "@/services/dataImport/dto/importResult.dto"
import { DataImportSourceEnum } from "@/services/dataImport/dto/importSource.dto"
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
import { BaseProvider } from "@/services/dataImport/providers/services/base/baseProvider"
import { TmdbProvider } from "@/services/dataImport/providers/services/tmdbProvider"
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

@Injectable()
export class TraktProvider extends BaseProvider {
  constructor(
    tmdbProvider: TmdbProvider,
  ) {
    super(DataImportSourceEnum.TRAKT, tmdbProvider)
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

  async import(args: { files: Map<string, string> }): Promise<ImportRawResult> {
    const [watched, watchList, ratings, reviews, lists] = await Promise.all([
      this.importWatched({ files: args.files }),
      this.importWatchlist({ files: args.files }),
      this.importRatings({ files: args.files }),
      this.importReviews({ files: args.files }),
      this.importLists({ files: args.files }),
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

  private createBucket<T>(): ImportBucket<T> {
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

  private async toMedia(args: { media: TraktMediaRef, type: "movie" | "tv" }): Promise<Media> {
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

  private async importWatched(args: { files: Map<string, string> }): Promise<ImportBucket<Media>> {
    const movies = this.parseFile({ files: args.files, fileName: "watched-movies.json", schema: traktWatchedMovieItemSchema })
    const shows = this.parseFile({ files: args.files, fileName: "watched-shows.json", schema: traktWatchedShowItemSchema })
    const historyEpisodes = this.parseFile({ files: args.files, fileName: "watched-history.json", schema: traktWatchedHistoryEpisodeItemSchema })

    const bucket = this.createBucket<Media>()
    const showProgress = new Map<number, Media>()

    for (const record of shows.success) {
      try {
        const media = await this.toMedia({ media: record.show, type: "tv" })
        media.createdAt = record.last_watched_at
        media.episodesProgress = []
        showProgress.set(record.show.ids.trakt, media)
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: record }))
      }
    }

    for (const record of historyEpisodes.success) {
      const show = showProgress.get(record.show.ids.trakt)

      if (!show) {
        continue
      }

      show.episodesProgress!.push({
        status: "watched",
        seasonNumber: record.episode.season,
        episodeNumber: record.episode.number,
      })
    }

    for (const record of movies.success) {
      try {
        const media = await this.toMedia({ media: record.movie, type: "movie" })
        media.createdAt = record.last_watched_at
        bucket.success.push(media)
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: record }))
      }
    }

    bucket.success.push(...showProgress.values())
    bucket.failed.push(...movies.failed, ...shows.failed)

    return bucket
  }

  private async processListItem(args: { record: z.infer<typeof traktCustomListItemSchema> }): Promise<Media> {
    const ref = args.record.type === "movie" ? args.record.movie : args.record.show
    const media = await this.toMedia({ media: ref, type: args.record.type === "movie" ? "movie" : "tv" })
    media.createdAt = args.record.listed_at
    media.note = args.record.notes ?? undefined

    return media
  }

  private async importWatchlist(args: { files: Map<string, string> }): Promise<ImportBucket<Media>> {
    const parsed = this.parseFile({ files: args.files, fileName: "lists-watchlist.json", schema: traktWatchlistItemSchema })
    const bucket = this.createBucket<Media>()

    for (const record of parsed.success) {
      try {
        const media = await this.processListItem({ record })
        bucket.success.push(media)
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: record }))
      }
    }

    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async importRatings(args: { files: Map<string, string> }): Promise<ImportBucket<Rating>> {
    const movies = this.parseFile({ files: args.files, fileName: "ratings-movies.json", schema: traktRatingMovieItemSchema })
    const shows = this.parseFile({ files: args.files, fileName: "ratings-shows.json", schema: traktRatingShowItemSchema })
    const bucket = this.createBucket<Rating>()

    const records: { ref: TraktMediaRef, type: "movie" | "tv", value: number, createdAt: Date, source: unknown }[] = [
      ...movies.success.map(record => ({
        ref: record.movie,
        type: "movie" as const,
        value: record.rating,
        createdAt: record.rated_at,
        source: record,
      })),
      ...shows.success.map(record => ({
        ref: record.show,
        type: "tv" as const,
        value: record.rating,
        createdAt: record.rated_at,
        source: record,
      })),
    ]

    for (const record of records) {
      try {
        const media = await this.toMedia({ media: record.ref, type: record.type })
        bucket.success.push({
          media,
          value: record.value,
          createdAt: record.createdAt,
        })
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: record.source }))
      }
    }

    bucket.failed.push(...movies.failed, ...shows.failed)

    return bucket
  }

  private async importReviews(args: { files: Map<string, string> }): Promise<ImportBucket<Review>> {
    const movies = this.parseFile({ files: args.files, fileName: "comments-movies.json", schema: traktCommentMovieItemSchema })
    const shows = this.parseFile({ files: args.files, fileName: "comments-shows.json", schema: traktCommentShowItemSchema })
    const bucket = this.createBucket<Review>()

    const records = [
      ...movies.success.map(record => ({ ...record, ref: record.movie, mediaType: "movie" as const })),
      ...shows.success.map(record => ({ ...record, ref: record.show, mediaType: "tv" as const })),
    ]

    for (const record of records) {
      try {
        const media = await this.toMedia({ media: record.ref, type: record.mediaType })
        bucket.success.push({
          media,
          content: record.comment.comment,
          createdAt: record.comment.created_at,
          updatedAt: record.comment.updated_at,
          rate: record.comment.user_rating ?? undefined,
        })
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: record }))
      }
    }

    bucket.failed.push(...movies.failed, ...shows.failed)

    return bucket
  }

  private async importLists(args: { files: Map<string, string> }): Promise<ImportBucket<List>> {
    const bucket = this.createBucket<List>()

    const parsedListsMetadata = this.parseFile({ files: args.files, fileName: "lists-lists.json", schema: traktCustomListMetadataSchema })
    bucket.failed.push(...parsedListsMetadata.failed)

    for (const listMetadata of parsedListsMetadata.success) {
      try {
        const itemsFileName = [...args.files.keys()].find(fileName =>
          CUSTOM_LIST_FILE_NAME_PATTERN.test(fileName) && fileName.startsWith(`lists-list-${listMetadata.ids.trakt}-`),
        )
        const itemsFileContent = itemsFileName ? args.files.get(itemsFileName) : null

        const items: ImportBucket<Media> = this.createBucket<Media>()

        if (itemsFileContent && itemsFileName) {
          const parsedItemsJson = this.convertStringToJson({ content: itemsFileContent, fileName: itemsFileName })
          const itemsJson = Array.isArray(parsedItemsJson) ? parsedItemsJson : [parsedItemsJson]
          const parsedItems = this.safeParseJson({ json: itemsJson, schema: traktCustomListItemSchema })

          for (const record of parsedItems.success) {
            try {
              const media = await this.processListItem({ record })
              items.success.push(media)
            }
            catch (error) {
              items.failed.push(this.toFailure({ error, sourceRecord: record }))
            }
          }

          items.failed.push(...parsedItems.failed)
        }

        bucket.success.push({
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

    if (favorites.success.length) {
      const items: ImportBucket<Media> = this.createBucket<Media>()

      for (const record of favorites.success) {
        try {
          const media = await this.processListItem({ record })
          items.success.push(media)
        }
        catch (error) {
          items.failed.push(this.toFailure({ error, sourceRecord: record }))
        }
      }

      items.failed.push(...favorites.failed)

      bucket.success.push({
        title: "Favorites",
        isPrivate: false,
        items,
      })
    }

    return bucket
  }

  private toFailure(args: { error: unknown, sourceRecord: unknown }): Failure {
    return {
      reason: args.error instanceof Error ? args.error.message : String(args.error),
      sourceRecord: args.sourceRecord,
    }
  }
}
