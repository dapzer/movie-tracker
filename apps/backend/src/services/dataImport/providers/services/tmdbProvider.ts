import { TmdbMediaTypeEnum, TmdbSearchResponseResultItemType, TmdbSearchResponseType } from "@movie-tracker/types"
import { FetchError } from "@movie-tracker/utils"
import { Injectable, Logger } from "@nestjs/common"
import { tmdbApi } from "@/api/instance"
import { TmdbNotFoundError, TmdbResolutionError } from "@/shared/errors/dataImport"

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

const TOO_MANY_REQUESTS_STATUS = 429
const DEFAULT_RETRY_AFTER_SECONDS = 1

@Injectable()
export class TmdbProvider {
  private readonly logger = new Logger("TmdbProvider")

  private async request<T>(args: { endpoint: string, params: Record<string, string | number | boolean | undefined> }): Promise<T> {
    while (true) {
      try {
        return await tmdbApi.get<T>(args.endpoint, { params: args.params })
      }
      catch (error) {
        if (error instanceof FetchError && error.statusCode === TOO_MANY_REQUESTS_STATUS) {
          this.logger.warn(`TMDB rate limit reached for "${args.endpoint}". Retrying.`)
          await new Promise(resolve => setTimeout(resolve, DEFAULT_RETRY_AFTER_SECONDS * 1000))
          continue
        }

        throw error
      }
    }
  }

  async findByExternalId(args: { externalId: string, source: TmdbExternalIdSource }): Promise<{ id: number, type: "movie" | "tv" }> {
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
      return { id: movie.id, type: "movie" }
    }

    const tv = response.tv_results?.[0]
    if (tv) {
      return { id: tv.id, type: "tv" }
    }

    throw new TmdbNotFoundError()
  }

  async findByTitleAndReleaseDate(args: { title: string, year?: number, type?: "movie" | "tv" }): Promise<{ id: number, type: "movie" | "tv" }> {
    const match = async (mediaType: "movie" | "tv") => {
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
      const result = await match(args.type)
      if (!result) {
        throw new TmdbNotFoundError()
      }
      return { id: result.id, type: args.type }
    }

    const [movie, tv] = await Promise.all([match("movie"), match("tv")])
    const result = movie ?? tv

    if (!result) {
      throw new TmdbNotFoundError()
    }

    return { id: result.id, type: movie ? "movie" : "tv" }
  }

  private pickSearchResult(args: { results: TmdbSearchResponseResultItemType[], title: string, year?: number }): TmdbSearchResponseResultItemType | null {
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

  getMediaTypeValue(args: { type: "movie" | "tv" }): TmdbMediaTypeEnum {
    return args.type === "movie" ? TmdbMediaTypeEnum.MOVIE : TmdbMediaTypeEnum.TV
  }
}
