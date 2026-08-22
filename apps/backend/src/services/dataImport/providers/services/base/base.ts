import { Buffer } from "node:buffer"
import {
  DataImportBucketType,
  DataImportMediaType,
  DataImportRawResultType,
  DataImportSourceEnum,
} from "@movie-tracker/types"
import { Injectable } from "@nestjs/common"
import { z } from "zod"
import { TmdbResolver } from "@/services/dataImport/providers/services/base/tmdbResolver"
import { SourceFileParseError, SourceFilesMissingError } from "@/shared/errors/dataImport"
import { convertCsvToJson } from "@/shared/utils/convertCsvToJson"
import { extractArchiveData } from "@/shared/utils/extractArchiveData"

export interface ResolveMediaInput {
  tmdbId?: number
  imdbId?: string
  tvdbId?: number
  title: string
  year?: number
  type?: "movie" | "tv"
}

@Injectable()
export abstract class BaseService {
  protected constructor(
    readonly name: DataImportSourceEnum,
    protected readonly tmdbResolver: TmdbResolver,
  ) {
  }

  abstract import(args: { files: Map<string, string> }): Promise<DataImportRawResultType>

  abstract get requiredFiles(): string[]

  validateFiles(args: { files: Map<string, string> }): void {
    const missingFiles: Array<string> = []

    for (const fileName of this.requiredFiles) {
      if (!args.files.has(fileName)) {
        missingFiles.push(fileName)
      }
    }

    if (missingFiles.length > 0) {
      throw new SourceFilesMissingError({ fileNames: missingFiles })
    }
  }

  protected async unzip(args: { archive: Buffer | Uint8Array }): Promise<Map<string, string>> {
    return extractArchiveData(args.archive)
  }

  protected async findByTitleAndReleaseDate(args: { title: string, year?: number, type?: "movie" | "tv" }) {
    return this.tmdbResolver.findByTitleAndReleaseDate(args)
  }

  private toReleaseDate(args: { releaseDate?: string, year?: number }): Date | undefined {
    if (args.releaseDate) {
      const parsed = new Date(args.releaseDate)
      if (!Number.isNaN(parsed.getTime())) {
        return parsed
      }
    }

    return args.year ? new Date(Date.UTC(args.year, 0, 1)) : undefined
  }

  protected async resolveMedia(args: ResolveMediaInput): Promise<Pick<DataImportMediaType, "ids" | "type" | "releaseDate">> {
    if (args.tmdbId) {
      return {
        ids: {
          tmdbId: args.tmdbId,
          imdbId: args.imdbId,
        },
        type: args.type ?? "movie",
        releaseDate: this.toReleaseDate({ year: args.year }),
      }
    }

    if (args.imdbId) {
      const result = await this.tmdbResolver.findByExternalId({ externalId: args.imdbId, source: "imdb_id" })
      return {
        ids: { tmdbId: result.id, imdbId: args.imdbId },
        type: args.type ?? result.type,
        releaseDate: this.toReleaseDate({ releaseDate: result.releaseDate, year: args.year }),
      }
    }

    if (args.tvdbId) {
      const result = await this.tmdbResolver.findByExternalId({
        externalId: String(args.tvdbId),
        source: "tvdb_id",
      })
      return {
        ids: { tmdbId: result.id },
        type: args.type ?? result.type,
        releaseDate: this.toReleaseDate({ releaseDate: result.releaseDate, year: args.year }),
      }
    }

    const result = await this.findByTitleAndReleaseDate({ title: args.title, year: args.year, type: args.type })

    return {
      ids: {
        tmdbId: result.id,
        imdbId: args.imdbId,
      },
      type: result.type,
      releaseDate: this.toReleaseDate({ releaseDate: result.releaseDate, year: args.year }),
    }
  }

  parseJson<T extends z.ZodType>(args: { json: Array<Record<string, unknown>>, schema: T }): Array<z.infer<T>> {
    return args.json.map(record => args.schema.parse(record))
  }

  safeParseJson<T extends z.ZodType>(args: { json: Array<Record<string, unknown>>, schema: T }): DataImportBucketType<z.infer<T>> {
    const success: z.infer<T>[] = []
    const failed: { reason: string, sourceRecord: unknown }[] = []

    for (const item of args.json) {
      const parsed = args.schema.safeParse(item)

      if (parsed.success) {
        success.push(parsed.data)
      }
      else {
        failed.push({ reason: parsed.error.message, sourceRecord: item })
      }
    }

    return { success, failed }
  }

  convertCsvToJson(args: { content: string, fileName: string }): Array<Record<string, unknown>> {
    try {
      return convertCsvToJson(args.content)
    }
    catch (error) {
      throw new SourceFileParseError({ fileName: args.fileName, cause: error })
    }
  }

  convertStringToJson(args: { content: string, fileName: string }): Record<string, unknown> | Array<Record<string, unknown>> {
    try {
      return JSON.parse(args.content)
    }
    catch (error) {
      throw new SourceFileParseError({ fileName: args.fileName, cause: error })
    }
  }
}
