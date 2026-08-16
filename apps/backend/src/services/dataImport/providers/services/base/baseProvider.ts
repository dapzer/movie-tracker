import { Buffer } from "node:buffer"
import { Injectable } from "@nestjs/common"
import { z } from "zod"
import { ImportBucket, ImportRawResult, Media } from "@/services/dataImport/dto/importResult.dto"
import { DataImportSource } from "@/services/dataImport/dto/importSource.dto"
import { TmdbProvider } from "@/services/dataImport/providers/services/tmdbProvider"
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
export abstract class BaseProvider {
  protected constructor(
    readonly name: DataImportSource,
    protected readonly tmdbProvider: TmdbProvider,
  ) {
  }

  abstract import(args: { files: Map<string, string> }): Promise<ImportRawResult>

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
    return this.tmdbProvider.findByTitleAndReleaseDate(args)
  }

  protected async resolveMedia(args: ResolveMediaInput): Promise<Pick<Media, "ids" | "type">> {
    if (args.tmdbId) {
      return {
        ids: {
          tmdbId: args.tmdbId,
          imdbId: args.imdbId,
        },
        type: args.type ?? "movie",
      }
    }

    if (args.imdbId) {
      const result = await this.tmdbProvider.findByExternalId({ externalId: args.imdbId, source: "imdb_id" })
      return {
        ids: { tmdbId: result.id, imdbId: args.imdbId },
        type: args.type ?? result.type,
      }
    }

    if (args.tvdbId) {
      const result = await this.tmdbProvider.findByExternalId({
        externalId: String(args.tvdbId),
        source: "tvdb_id",
      })
      return {
        ids: { tmdbId: result.id },
        type: args.type ?? result.type,
      }
    }

    const result = await this.findByTitleAndReleaseDate({ title: args.title, year: args.year, type: args.type })

    return {
      ids: {
        tmdbId: result.id,
        imdbId: args.imdbId,
      },
      type: result.type,
    }
  }

  parseJson<T extends z.ZodType>(args: { json: Array<Record<string, unknown>>, schema: T }): Array<z.infer<T>> {
    return args.json.map(record => args.schema.parse(record))
  }

  safeParseJson<T extends z.ZodType>(args: { json: Array<Record<string, unknown>>, schema: T }): ImportBucket<z.infer<T>> {
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
