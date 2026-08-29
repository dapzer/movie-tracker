import {
  DataImportBucketType,
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
  letterboxdDiarySchema,
  letterboxdListItemSchema,
  letterboxdListMetadataSchema,
  letterboxdRatingSchema,
  letterboxdReviewSchema,
  letterboxdWatchedSchema,
  letterboxdWatchlistSchema,
} from "@/services/dataImport/dto/letterboxdRaw.dto"
import { BaseService } from "@/services/dataImport/providers/services/base/base"
import { TmdbResolver } from "@/services/dataImport/providers/services/base/tmdbResolver"
import { LetterboxdInvalidListContentError, SourceFileMissingError } from "@/shared/errors/dataImport"
import { convertCsvToJson } from "@/shared/utils/convertCsvToJson"

const LIST_FILE_NAME_PATTERN = /^lists\/.+\.csv$/
const LIST_METADATA_SEPARATOR = "Date,Name,Tags,URL,Description"
const LIST_ITEMS_SEPARATOR = "Position,Name,Year,URL,Description"

type LetterboxdFilmRecord = z.infer<typeof letterboxdWatchedSchema>
type LetterboxdDiaryRecord = z.infer<typeof letterboxdDiarySchema>

@Injectable()
export class LetterboxdProvider extends BaseService {
  constructor(
    tmdbResolver: TmdbResolver,
  ) {
    super(DataImportSourceEnum.LETTERBOXD, tmdbResolver)
  }

  get requiredFiles(): string[] {
    return [
      "watched.csv",
      "watchlist.csv",
      "ratings.csv",
      "reviews.csv",
    ]
  }

  async import(args: { files: Map<string, string> }): Promise<DataImportRawResultType> {
    const [watched, watchList, ratings, reviews, lists, diary] = await Promise.all([
      this.importWatched({ files: args.files }),
      this.importWatchlist({ files: args.files }),
      this.importRatings({ files: args.files }),
      this.importReviews({ files: args.files }),
      this.importLists({ files: args.files }),
      this.importDiary({ files: args.files }),
    ])

    if (diary) {
      lists.success.push(diary)
    }

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

    const parsedJson = this.convertCsvToJson({ content, fileName: args.fileName })

    return this.safeParseJson({ json: parsedJson, schema: args.schema })
  }

  private async resolveFilmMedia(args: { record: LetterboxdFilmRecord }): Promise<DataImportMediaType> {
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

  private async collectMedia(args: { records: LetterboxdFilmRecord[] }): Promise<DataImportBucketType<DataImportMediaType>> {
    return this.processToBucket({
      records: args.records,
      process: record => this.resolveFilmMedia({ record }),
    })
  }

  private async importWatched(args: { files: Map<string, string> }): Promise<DataImportBucketType<DataImportMediaType>> {
    const parsed = this.parseFile({ files: args.files, fileName: "watched.csv", schema: letterboxdWatchedSchema })
    const bucket = await this.collectMedia({ records: parsed.success })
    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async importWatchlist(args: { files: Map<string, string> }): Promise<DataImportBucketType<DataImportMediaType>> {
    const parsed = this.parseFile({ files: args.files, fileName: "watchlist.csv", schema: letterboxdWatchlistSchema })
    const bucket = await this.collectMedia({ records: parsed.success })
    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async importRatings(args: { files: Map<string, string> }): Promise<DataImportBucketType<DataImportRatingType>> {
    const parsed = this.parseFile({ files: args.files, fileName: "ratings.csv", schema: letterboxdRatingSchema })
    const bucket = await this.processToBucket({
      records: parsed.success,
      process: async (record) => {
        const media = await this.resolveFilmMedia({ record })
        return {
          media,
          value: record.Rating * 2,
          createdAt: record.Date,
        }
      },
    })

    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async importReviews(args: { files: Map<string, string> }): Promise<DataImportBucketType<DataImportReviewType>> {
    const parsed = this.parseFile({ files: args.files, fileName: "reviews.csv", schema: letterboxdReviewSchema })
    const bucket = await this.processToBucket({
      records: parsed.success,
      process: async (record) => {
        const media = await this.resolveFilmMedia({ record })
        return {
          media,
          content: record.Review,
          createdAt: record.Date,
          updatedAt: record.Date,
          rate: record.Rating === undefined ? undefined : record.Rating * 2,
        }
      },
    })

    bucket.failed.push(...parsed.failed)

    return bucket
  }

  private async resolveDiaryMedia(args: { record: LetterboxdDiaryRecord }): Promise<DataImportMediaType> {
    const resolved = await this.resolveMedia({
      title: args.record.Name,
      year: args.record.Year,
      type: "movie",
    })

    return {
      ...resolved,
      title: args.record.Name,
      createdAt: args.record["Watched Date"] ?? args.record.Date,
    }
  }

  private async importDiary(args: { files: Map<string, string> }): Promise<DataImportListType | undefined> {
    const content = args.files.get("diary.csv")

    if (!content) {
      return undefined
    }

    const parsedJson = this.convertCsvToJson({ content, fileName: "diary.csv" })
    const parsed = this.safeParseJson({ json: parsedJson, schema: letterboxdDiarySchema })

    const results = await this.processRecords({
      records: parsed.success,
      process: record => this.resolveDiaryMedia({ record }),
    })

    const items: DataImportBucketType<DataImportMediaType> = this.createBucket<DataImportMediaType>()
    let createdAt: Date | undefined

    for (const result of results) {
      if ("value" in result) {
        items.success.push(result.value)

        if (!createdAt || (result.value.createdAt && result.value.createdAt < createdAt)) {
          createdAt = result.value.createdAt
        }
      }
      else {
        items.failed.push(result.failure)
      }
    }

    items.failed.push(...parsed.failed)

    return {
      id: "diary",
      title: "Diary",
      isPrivate: true,
      createdAt,
      items,
    }
  }

  private async importLists(args: { files: Map<string, string> }): Promise<DataImportBucketType<DataImportListType>> {
    const bucket = this.createBucket<DataImportListType>()

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

  private async parseListFile(args: { content: string }): Promise<DataImportListType> {
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

    const items: DataImportBucketType<DataImportMediaType> = this.createBucket<DataImportMediaType>()

    if (itemsSection) {
      const itemsCsv = itemsSection.split(/\r?\n/).join("\n")
      const parsedJson = this.convertCsvToJson({ content: itemsCsv, fileName: `list_items-${metadata.Name}.csv` })
      const parsed = this.safeParseJson({ json: parsedJson, schema: letterboxdListItemSchema })

      const itemsBucket = await this.processToBucket({
        records: parsed.success,
        process: async (record) => {
          const media = await this.resolveMedia({
            title: record.Name,
            year: record.Year,
            type: "movie",
          })

          return {
            ...media,
            title: record.Name,
            note: record.Description || undefined,
            createdAt: metadata.Date,
          }
        },
      })

      items.success.push(...itemsBucket.success)
      items.failed.push(...itemsBucket.failed, ...parsed.failed)
    }

    return {
      id: new URL(metadata.URL).pathname.replace(/^\/+|\/+$/g, ""),
      title: metadata.Name,
      description: metadata.Description || undefined,
      isPrivate: false,
      createdAt: metadata.Date,
      items,
    }
  }
}
