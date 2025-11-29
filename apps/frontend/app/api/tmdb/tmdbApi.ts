import type {
  TmdbCreditsType,
  TmdbMediaDetailsSeasonKey,
  TmdbMediaDetailsType,
  TmdbPersonCreditsType,
  TmdbPersonExternalIdsType,
  TmdbSearchResponseType,
  TmdbSeasonDetailsType,
  TmdbUpcomingMoviesResponseType,
  TmdbVideosType,
} from "@movie-tracker/types"
import type {
  TmdbDefaultQueriesType,
  TmdbDiscoverMovieQueriesType,
  TmdbDiscoverTvQueriesType,
  TmdbPersonCreditsQueriesType,
  TmdbPopularQueriesType,
  TmdbSearchQueriesType,
  TmdbSeasonsQueriesType,
  TmdbTvAiringTodayQueriesType,
  TmdbTvOnTheAirQueriesType,
  TmdbUpcomingMoviesQueriesType,
  TmdbVideosQueriesType,
} from "~/api/tmdb/tmdbApiTypes"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { contentApi } from "~/api/instance"

export async function getTmdbSearchApi(queries: TmdbSearchQueriesType) {
  if (queries.searchValue.length === 0)
    return null

  return contentApi.get<TmdbSearchResponseType>("search/multi", {
    params: {
      query: queries.searchValue,
      page: queries.page,
      language: queries.language,
      include_adult: true,
    },
  })
}

export async function getTmdbSearchMovieApi(queries: TmdbSearchQueriesType) {
  if (queries.searchValue.length === 0)
    return null

  return contentApi.get<TmdbSearchResponseType>("search/movie", {
    params: {
      query: queries.searchValue,
      page: queries.page,
      language: queries.language,
      include_adult: true,
    },
  })
}

export async function getTmdbSearchTvApi(queries: TmdbSearchQueriesType) {
  if (queries.searchValue.length === 0)
    return null

  return contentApi.get<TmdbSearchResponseType>("search/tv", {
    params: {
      query: queries.searchValue,
      page: queries.page,
      language: queries.language,
      include_adult: true,
    },
  })
}

export async function getTmdbSearchPersonApi(queries: TmdbSearchQueriesType) {
  if (queries.searchValue.length === 0)
    return null

  return contentApi.get<TmdbSearchResponseType>("search/person", {
    params: {
      query: queries.searchValue,
      page: queries.page,
      language: queries.language,
      include_adult: true,
    },
  })
}

export async function getTmdbDetailApi<T = TmdbMediaDetailsType>(queries: TmdbDefaultQueriesType) {
  return contentApi.get<T>(`${queries.mediaType}/${queries.mediaId}`, {
    params: {
      language: queries.language,
    },
  })
}

export async function getTmdbCreditsApi(queries: TmdbDefaultQueriesType) {
  return contentApi.get<TmdbCreditsType>(`${queries.mediaType}/${queries.mediaId}/${queries.mediaType === TmdbMediaTypeEnum.TV ? "aggregate_credits" : "credits"}`, {
    params: {
      language: queries.language,
    },
  })
}

export async function getTmdbPersonCreditsApi(queries: TmdbPersonCreditsQueriesType) {
  return contentApi.get<TmdbPersonCreditsType>(`person/${queries.personId}/combined_credits`, {
    params: {
      language: queries.language,
    },
  })
}

export async function getTmdbPersonExternalIdsApi(queries: TmdbDefaultQueriesType) {
  return contentApi.get<TmdbPersonExternalIdsType>(`person/${queries.mediaId}/external_ids`, {
    params: {
      language: queries.language,
    },
  })
}

export async function getTmdbPopularApi(queries: TmdbPopularQueriesType) {
  return contentApi.get<TmdbSearchResponseType>(`${queries.mediaType}/popular`, {
    params: {
      language: queries.language,
      page: queries.page,
      time_window: queries.timeWindow,
    },
  })
}

export async function getTmdbUpcomingMoviesApi(queries: TmdbUpcomingMoviesQueriesType) {
  return contentApi.get<TmdbUpcomingMoviesResponseType>("movie/upcoming", {
    params: {
      language: queries.language,
      page: queries.page,
      region: queries.region,
    },
  })
}

export async function getTmdbTvOnTheAirApi(queries: TmdbTvOnTheAirQueriesType) {
  return contentApi.get<TmdbSearchResponseType>("tv/on_the_air", {
    params: {
      language: queries.language,
      page: queries.page,
    },
  })
}

export async function getTmdbTvAiringTodayApi(queries: TmdbTvAiringTodayQueriesType) {
  return contentApi.get<TmdbSearchResponseType>("tv/airing_today", {
    params: {
      language: queries.language,
      page: queries.page,
    },
  })
}

export async function getTmdbDiscoverMovieApi(queries: TmdbDiscoverMovieQueriesType) {
  return contentApi.get<TmdbSearchResponseType>("discover/movie", {
    params: {
      ...queries,
    },
  })
}

export async function getTmdbDiscoverTvApi(queries: TmdbDiscoverTvQueriesType) {
  return contentApi.get<TmdbSearchResponseType>("discover/tv", {
    params: {
      ...queries,
    },
  })
}

export async function getTmdbRecommendationsApi(queries: TmdbDefaultQueriesType) {
  return contentApi.get<TmdbSearchResponseType>(`${queries.mediaType}/${queries.mediaId}/recommendations`, {
    params: {
      language: queries.language,
      page: queries.page ?? 1,
    },
  })
}

export async function getTmdbVideosApi(queries: TmdbVideosQueriesType) {
  return contentApi.get<TmdbVideosType>(`${queries.mediaType}/${queries.mediaId}/videos`, {
    params: {
      language: queries.language,
      include_video_language: queries.includeVideoLanguage,
    },
  })
}

export async function getTmdbSeasonsApi(queries: TmdbSeasonsQueriesType): Promise<TmdbSeasonDetailsType[] | null> {
  let details = {} as TmdbMediaDetailsType
  const seasons: TmdbSeasonDetailsType[] = []

  const maxSeasonsInRequest = 20
  let cursor = 0

  while (true) {
    const start = cursor * maxSeasonsInRequest
    const end = start + maxSeasonsInRequest

    const seasonQuery = Array.from({ length: maxSeasonsInRequest }, (_, index) => `season/${start + index}`)

    const res = await contentApi.get<TmdbMediaDetailsType>(`${queries.mediaType}/${queries.mediaId}`, {
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

  return seasons
}
