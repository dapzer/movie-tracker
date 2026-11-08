import { ExternalServiceError } from "@/shared/errors/core"

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

export class TmdbAmbiguousMatchError extends ExternalServiceError {
  constructor() {
    super("TMDB media resolution was ambiguous.")
  }
}

export class TmdbNotFoundError extends ExternalServiceError {
  constructor() {
    super("TMDB media was not found.")
  }
}
