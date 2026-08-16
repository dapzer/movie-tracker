import type { CustomErrorOptions } from "@/shared/errors/customError"
import { BadArgumentsError, ExternalServiceError } from "@/shared/errors/core"

export class UnsupportedDataImportSourceError extends BadArgumentsError {
  source: string

  constructor(args: { source: string } & CustomErrorOptions) {
    super(args.message ?? `Unsupported data import source: ${args.source}.`, { cause: args.cause, details: args.details })
    this.source = args.source
  }
}

export class InvalidDataImportArchiveError extends BadArgumentsError {
  constructor(args: CustomErrorOptions = {}) {
    super(args.message ?? "Data import archive is invalid or corrupt.", { cause: args.cause, details: args.details })
  }
}

export class DataImportArchiveLimitError extends BadArgumentsError {
  limit: string

  constructor(args: { limit: string } & CustomErrorOptions) {
    super(args.message ?? `Data import archive exceeds ${args.limit}.`, { cause: args.cause, details: args.details })
    this.limit = args.limit
  }
}

export class SourceFileParseError extends BadArgumentsError {
  fileName: string

  constructor(args: { fileName: string } & CustomErrorOptions) {
    super(args.message ?? `Unable to parse source file: ${args.fileName}.`, { cause: args.cause, details: args.details })
    this.fileName = args.fileName
  }
}

export class SourceFileMissingError extends BadArgumentsError {
  fileName: string

  constructor(args: { fileName: string } & CustomErrorOptions) {
    super(args.message ?? `Source file is missing: ${args.fileName}.`, { cause: args.cause, details: args.details })
    this.fileName = args.fileName
  }
}

export class InvalidSourceRecordError extends BadArgumentsError {
  constructor(args: CustomErrorOptions = {}) {
    super(args.message ?? "Source record is invalid.", { cause: args.cause, details: args.details })
  }
}

export type TmdbLookupSource = "find" | "search"

export class TmdbResolutionError extends ExternalServiceError {
  source: TmdbLookupSource
  status?: number

  constructor(source: TmdbLookupSource, status?: number) {
    super("TMDB media resolution failed.", {
      details: status === undefined ? { source } : { source, status },
    })
    this.source = source
    this.status = status
  }
}

export class TmdbNotFoundError extends ExternalServiceError {
  constructor() {
    super("TMDB media was not found.")
  }
}

export class TmdbAmbiguousMatchError extends ExternalServiceError {
  constructor() {
    super("TMDB media resolution was ambiguous.")
  }
}

export class LetterboxdInvalidListContentError extends BadArgumentsError {
  constructor(args: CustomErrorOptions = {}) {
    super(args.message ?? "Letterboxd list content is invalid.", { cause: args.cause, details: args.details })
  }
}
