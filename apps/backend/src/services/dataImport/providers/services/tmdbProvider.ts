import { TmdbSearchResponseResultItemType, TmdbSearchResponseType } from "@movie-tracker/types"
import { FetchError } from "@movie-tracker/utils"
import { CACHE_MANAGER } from "@nestjs/cache-manager"
import { HttpStatus, Inject, Injectable, Logger } from "@nestjs/common"
import { Cache } from "cache-manager"
import { tmdbApi } from "@/api/instance"
import { TmdbNotFoundError, TmdbResolutionError } from "@/shared/errors/dataImport"
import { getMillisecondsFromDays } from "@/shared/utils/getMillisecondsFromDays"
import { getMillisecondsFromHours } from "@/shared/utils/getMillisecondsFromHours"
import { getMillisecondsFromSeconds } from "@/shared/utils/getMillisecondsFromSeconds"

export type TmdbExternalIdSource = "imdb_id" | "tvdb_id"

export interface TmdbFindResultItemType {
  id: number
  title?: string
  name?: string
}

export interface TmdbFindResponseType {
  movie_results: TmdbFindResultItemType[]
  tv_results: TmdbFindResultItemType[]
}

@Injectable()
export class TmdbProvider {
  private readonly logger = new Logger("TmdbProvider")
  private readonly inFlight = new Map<string, Promise<unknown>>()
  private readonly MAX_RETRIES = 10

  constructor(@Inject(CACHE_MANAGER) private cacheManager: Cache) {
  }

  private async cached<T>(args: { key: string, ttl: number, resolve: () => Promise<T> }): Promise<T> {
    const cached = await this.cacheManager.get<T>(args.key)
    if (cached !== undefined && cached !== null) {
      return cached
    }

    const pending = this.inFlight.get(args.key)
    if (pending) {
      return pending as Promise<T>
    }

    const promise = args.resolve()
      .then(async (result) => {
        await this.cacheManager.set(args.key, result, args.ttl)
        return result
      })
      .finally(() => {
        this.inFlight.delete(args.key)
      })

    this.inFlight.set(args.key, promise)

    return promise
  }

  private getRetryAfterMs(args: {
    headers?: Record<string, string>
    defaultValue?: number
    maxValue?: number
  }): number {
    const retryAfter = args.headers?.["retry-after"]

    if (!retryAfter) {
      return args.defaultValue
    }

    const seconds = Number(retryAfter)
    if (Number.isFinite(seconds) && seconds >= 0) {
      return Math.min(seconds * 1000, args.maxValue)
    }

    const date = Date.parse(retryAfter)
    if (!Number.isNaN(date)) {
      return Math.min(Math.max(date - Date.now(), 0), args.maxValue)
    }

    return args.defaultValue
  }

  private async request<T>(args: {
    endpoint: string
    params: Record<string, string | number | boolean | undefined>
  }): Promise<T> {
    let attempt = 0

    while (true) {
      try {
        return await tmdbApi.get<T>(args.endpoint, { params: args.params })
      }
      catch (error) {
        if (error instanceof FetchError && error.statusCode === HttpStatus.TOO_MANY_REQUESTS && attempt < this.MAX_RETRIES) {
          attempt++
          const retryAfterMs = this.getRetryAfterMs({
            headers: error.headers,
            defaultValue: getMillisecondsFromSeconds(1),
            maxValue: getMillisecondsFromSeconds(30),
          })
          this.logger.warn(`TMDB rate limit reached for "${args.endpoint}". Retrying in ${retryAfterMs}ms (attempt ${attempt}/${this.MAX_RETRIES}).`)
          await new Promise(resolve => setTimeout(resolve, retryAfterMs))
          continue
        }

        throw error
      }
    }
  }

  async findByExternalId(args: { externalId: string, source: TmdbExternalIdSource }): Promise<{
    id: number
    type: "movie" | "tv"
  }> {
    return this.cached({
      key: `import:tmdb:find:${args.source}:${args.externalId}`,
      ttl: getMillisecondsFromDays(7),
      resolve: async () => {
        let response: TmdbFindResponseType

        try {
          response = await this.request<TmdbFindResponseType>({
            endpoint: `find/${args.externalId}`,
            params: {
              external_source: args.source,
            },
          })
        }
        catch (error) {
          if (error instanceof FetchError) {
            throw new TmdbResolutionError("find", error.statusCode)
          }
          throw error
        }

        const movie = response.movie_results?.[0]
        if (movie) {
          return { id: movie.id, type: "movie" as const }
        }

        const tv = response.tv_results?.[0]
        if (tv) {
          return { id: tv.id, type: "tv" as const }
        }

        throw new TmdbNotFoundError()
      },
    })
  }

  async findByTitleAndReleaseDate(args: { title: string, year?: number, type?: "movie" | "tv" }): Promise<{
    id: number
    type: "movie" | "tv"
  }> {
    const normalizedTitle = args.title.trim().toLowerCase()

    return this.cached({
      key: `import:tmdb:search:${normalizedTitle}:${args.year ?? "any"}:${args.type ?? "any"}`,
      ttl: getMillisecondsFromHours(12),
      resolve: async () => {
        const getMatch = async (mediaType: "movie" | "tv") => {
          let response: TmdbSearchResponseType

          try {
            response = await this.request<TmdbSearchResponseType>({
              endpoint: `search/${mediaType}`,
              params: {
                query: args.title,
                year: mediaType === "movie" ? args.year : undefined,
                first_air_date_year: mediaType === "tv" ? args.year : undefined,
              },
            })
          }
          catch (error) {
            if (error instanceof FetchError) {
              throw new TmdbResolutionError("search", error.statusCode)
            }
            throw error
          }

          return this.pickSearchResult({ results: response.results, title: args.title, year: args.year })
        }

        if (args.type) {
          const result = await getMatch(args.type)
          if (!result) {
            throw new TmdbNotFoundError()
          }
          return { id: result.id, type: args.type }
        }

        const [movie, tv] = await Promise.all([getMatch("movie"), getMatch("tv")])
        const result = movie ?? tv

        if (!result) {
          throw new TmdbNotFoundError()
        }

        return { id: result.id, type: movie ? "movie" : "tv" }
      },
    })
  }

  private pickSearchResult(args: {
    results: TmdbSearchResponseResultItemType[]
    title: string
    year?: number
  }): TmdbSearchResponseResultItemType | null {
    if (!args.results.length) {
      return null
    }

    const normalizedTitle = args.title.trim().toLowerCase()

    const exact = args.results.find((result) => {
      const titles = [result.title, result.original_title, result.name, result.original_name]
        .filter(Boolean)
        .map(value => value!.trim().toLowerCase())

      if (!titles.includes(normalizedTitle)) {
        return false
      }

      if (args.year === undefined) {
        return true
      }

      const releaseDate = result.release_date ?? result.first_air_date
      return releaseDate?.startsWith(String(args.year)) ?? false
    })

    return exact ?? args.results[0]
  }
}
