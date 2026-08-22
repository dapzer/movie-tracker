import type { CustomErrorOptions } from "@/shared/errors/customError"
import { BadArgumentsError, ExternalServiceError, NotFoundError, UnauthorizedError } from "@/shared/errors/core"

export class DataImportNotFoundError extends NotFoundError {
  dataImportId: string

  constructor(args: { dataImportId: string } & CustomErrorOptions) {
    super(args.message ?? `Data import with id '${args.dataImportId}' doesn't exist.`, { cause: args.cause, details: args.details })
    this.dataImportId = args.dataImportId
  }
}

export class DataImportUnauthorizedError extends UnauthorizedError {
  userId: string
  dataImportId: string

  constructor(args: { userId: string, dataImportId: string } & CustomErrorOptions) {
    super(args.message ?? "Unauthorized.", { cause: args.cause, details: args.details })
    this.userId = args.userId
    this.dataImportId = args.dataImportId
  }
}

export class DataImportInvalidStatusError extends BadArgumentsError {
  dataImportId: string
  status: string

  constructor(args: { dataImportId: string, status: string } & CustomErrorOptions) {
    super(args.message ?? `Data import with id '${args.dataImportId}' cannot be processed in status '${args.status}'.`, { cause: args.cause, details: args.details })
    this.dataImportId = args.dataImportId
    this.status = args.status
  }
}

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

export class DataImportArchiveIsRequiredError extends BadArgumentsError {
  constructor(args: CustomErrorOptions = {}) {
    super(args.message ?? "Archive is required.", { cause: args.cause, details: args.details })
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

export class SourceFilesMissingError extends BadArgumentsError {
  fileNames: Array<string>

  constructor(args: { fileNames: Array<string> } & CustomErrorOptions) {
    super(args.message ?? `Source files are missing: ${args.fileNames.join(", ")}.`, { cause: args.cause, details: args.details })
    this.fileNames = args.fileNames
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
