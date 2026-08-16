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
  letterboxdListItemSchema,
  letterboxdListMetadataSchema,
  letterboxdRatingSchema,
  letterboxdReviewSchema,
  letterboxdWatchedSchema,
  letterboxdWatchlistSchema,
} from "@/services/dataImport/dto/letterboxdRaw.dto"
import { BaseProvider } from "@/services/dataImport/providers/services/base/baseProvider"
import { TmdbProvider } from "@/services/dataImport/providers/services/tmdbProvider"
import { LetterboxdInvalidListContentError } from "@/shared/errors/dataImport"
import { convertCsvToJson } from "@/shared/utils/convertCsvToJson"

const LIST_FILE_NAME_PATTERN = /^lists\/.+\.csv$/
const LIST_METADATA_SEPARATOR = "Date,Name,Tags,URL,Description"
const LIST_ITEMS_SEPARATOR = "Position,Name,Year,URL,Description"

type LetterboxdFilmRecord = z.infer<typeof letterboxdWatchedSchema>

@Injectable()
export class LetterboxdProvider extends BaseProvider {
  constructor(
    tmdbProvider: TmdbProvider,
  ) {
    super(DataImportSourceEnum.LETTERBOXD, tmdbProvider)
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
      return this.createBucket<z.infer<T>>()
    }

    const parsedJson = this.convertCsvToJson({ content, fileName: args.fileName })

    return this.safeParseJson({ json: parsedJson, schema: args.schema })
  }

  private async resolveFilmMedia(args: { record: LetterboxdFilmRecord }): Promise<Media> {
    const resolved = await this.resolveMedia({
      title: args.record.Name,
      year: args.record.Year,
      type: "movie",
    })

    return {
      ...resolved,
      title: args.record.Name,
      createdAt: args.record.Date,
    }
  }

  private async collectMedia(args: { records: LetterboxdFilmRecord[] }): Promise<ImportBucket<Media>> {
    const bucket = this.createBucket<Media>()

    for (const record of args.records) {
      try {
        const media = await this.resolveFilmMedia({ record })
        bucket.success.push(media)
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: record }))
      }
    }

    return bucket
  }

  private async importWatched(args: { files: Map<string, string> }): Promise<ImportBucket<Media>> {
    const parsed = this.parseFile({ files: args.files, fileName: "watched.csv", schema: letterboxdWatchedSchema })
    const bucket = await this.collectMedia({ records: parsed.success })
    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async importWatchlist(args: { files: Map<string, string> }): Promise<ImportBucket<Media>> {
    const parsed = this.parseFile({ files: args.files, fileName: "watchlist.csv", schema: letterboxdWatchlistSchema })
    const bucket = await this.collectMedia({ records: parsed.success })
    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async importRatings(args: { files: Map<string, string> }): Promise<ImportBucket<Rating>> {
    const parsed = this.parseFile({ files: args.files, fileName: "ratings.csv", schema: letterboxdRatingSchema })
    const bucket = this.createBucket<Rating>()

    for (const record of parsed.success) {
      try {
        const media = await this.resolveFilmMedia({ record })
        bucket.success.push({
          media,
          value: record.Rating * 2,
          createdAt: record.Date,
        })
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: record }))
      }
    }

    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async importReviews(args: { files: Map<string, string> }): Promise<ImportBucket<Review>> {
    const parsed = this.parseFile({ files: args.files, fileName: "reviews.csv", schema: letterboxdReviewSchema })
    const bucket = this.createBucket<Review>()

    for (const record of parsed.success) {
      try {
        const media = await this.resolveFilmMedia({ record })
        bucket.success.push({
          media,
          content: record.Review,
          createdAt: record.Date,
          updatedAt: record.Date,
          rate: record.Rating === undefined ? undefined : record.Rating * 2,
        })
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: record }))
      }
    }

    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async importLists(args: { files: Map<string, string> }): Promise<ImportBucket<List>> {
    const bucket = this.createBucket<List>()

    for (const [fileName, content] of args.files) {
      if (!LIST_FILE_NAME_PATTERN.test(fileName)) {
        continue
      }

      try {
        const list = await this.parseListFile({ content })
        bucket.success.push(list)
      }
      catch (error) {
        bucket.failed.push(this.toFailure({ error, sourceRecord: { fileName } }))
      }
    }

    return bucket
  }

  private async parseListFile(args: { content: string }): Promise<List> {
    const sections = args.content.split(/\r?\n\r?\n/)
    const metadataSection = sections.find(section => section.split(/\r?\n/).some(line => line.startsWith(LIST_METADATA_SEPARATOR)))
    const itemsSection = sections.find(section => section.split(/\r?\n/).some(line => line.startsWith(LIST_ITEMS_SEPARATOR)))

    if (!metadataSection) {
      throw new LetterboxdInvalidListContentError({
        message: "Letterboxd list content is missing metadata section.",
      })
    }

    const metadataCsv = metadataSection.split(/\r?\n/).slice(1).join("\n")
    const metadata = letterboxdListMetadataSchema.parse(convertCsvToJson(metadataCsv)[0])

    const items: ImportBucket<Media> = this.createBucket<Media>()

    if (itemsSection) {
      const itemsCsv = itemsSection.split(/\r?\n/).join("\n")
      const parsedJson = this.convertCsvToJson({ content: itemsCsv, fileName: `list_items-${metadata.Name}.csv` })
      const parsed = this.safeParseJson({ json: parsedJson, schema: letterboxdListItemSchema })

      for (const record of parsed.success) {
        try {
          const media = await this.resolveMedia({
            title: record.Name,
            year: record.Year,
            type: "movie",
          })

          items.success.push({
            ...media,
            title: record.Name,
            note: record.Description || undefined,
            createdAt: metadata.Date,
          })
        }
        catch (error) {
          items.failed.push(this.toFailure({ error, sourceRecord: record }))
        }
      }

      items.failed.push(...parsed.failed)
    }

    return {
      title: metadata.Name,
      description: metadata.Description || undefined,
      isPrivate: false,
      createdAt: metadata.Date,
      items,
    }
  }

  private toFailure(args: { error: unknown, sourceRecord: unknown }): Failure {
    return {
      reason: args.error instanceof Error ? args.error.message : String(args.error),
      sourceRecord: args.sourceRecord,
    }
  }
}
