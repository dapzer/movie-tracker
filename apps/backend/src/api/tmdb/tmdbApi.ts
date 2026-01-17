import type { TmdbMediaDetailsSeasonKey, TmdbMediaDetailsType, TmdbSeasonDetailsType } from "@movie-tracker/types"
import { tmdbApi } from "@/api/instance"
import {
  TmdbDefaultQueriesType,
  TmdbDetailsWithSeasonsResponseType,
  TmdbSeasonsQueriesType,
} from "@/api/tmdb/tmdbApiTypes"

export async function getTmdbDetailApi<T = TmdbMediaDetailsType>(queries: TmdbDefaultQueriesType) {
  return tmdbApi.get<T>(`${queries.mediaType}/${queries.mediaId}`, {
    params: {
      language: queries.language,
    },
  })
}

export async function getTmdbDetailsWithSeasonsApi(queries: TmdbSeasonsQueriesType): Promise<TmdbDetailsWithSeasonsResponseType | null> {
  let details = {} as TmdbMediaDetailsType
  const seasons: TmdbSeasonDetailsType[] = []

  const maxSeasonsInRequest = 20
  let cursor = 0

  while (true) {
    const start = cursor * maxSeasonsInRequest
    const end = start + maxSeasonsInRequest

    const seasonQuery = Array.from({ length: maxSeasonsInRequest }, (_, index) => `season/${start + index}`)

    const res = await tmdbApi.get<TmdbMediaDetailsType>(`${queries.mediaType}/${queries.mediaId}`, {
      params: {
        language: queries.language,
        append_to_response: seasonQuery.join(","),
      },
    })

    if (res) {
      for (let j = start; j <= end; j++) {
        const seasonKey: TmdbMediaDetailsSeasonKey = `season/${j}`

        if (seasonKey in res) {
          seasons.push(res[seasonKey] as TmdbSeasonDetailsType)
        }
      }

      if (cursor === 0) {
        details = res
      }
    }
    else {
      return null
    }

    if (details && end >= details.number_of_seasons)
      break
    cursor++
  }

  return { seasons, details }
}
