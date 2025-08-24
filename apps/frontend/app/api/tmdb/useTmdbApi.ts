import type { TmdbPersonType } from "@movie-tracker/types"
import type { Ref } from "vue"
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
import { useQuery } from "@tanstack/vue-query"
import {
  getTmdbCreditsApi,
  getTmdbDetailApi,
  getTmdbDiscoverMovieApi,
  getTmdbDiscoverTvApi,
  getTmdbPersonCreditsApi,
  getTmdbPersonExternalIdsApi,
  getTmdbPopularApi,
  getTmdbRecommendationsApi,
  getTmdbSearchApi,
  getTmdbSearchMovieApi,
  getTmdbSearchPersonApi,
  getTmdbSearchTvApi,
  getTmdbSeasonsApi,
  getTmdbTvAiringTodayApi,
  getTmdbTvOnTheAirApi,
  getTmdbUpcomingMoviesApi,
  getTmdbVideosApi,
} from "~/api/tmdb/tmdbApi"
import { TmdbQueryKeys } from "~/api/tmdb/tmdbApiQueryKeys"

export function useGetTmdbMovieDetailsApi(queries: Ref<TmdbDefaultQueriesType>, enabled?: boolean) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DETAILS,
      queries,
    ],
    enabled,
    queryFn: () => getTmdbDetailApi(queries.value),
  })
}

export function useGetTmdbPersonDetailsApi(queries: Ref<TmdbDefaultQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DETAILS,
      queries,
    ],
    queryFn: () => getTmdbDetailApi<TmdbPersonType>(queries.value),
  })
}

export function useGetTmdbMovieCreditsApi(queries: Ref<TmdbDefaultQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_CREDITS,
      queries,
    ],
    queryFn: () => getTmdbCreditsApi(queries.value),
  },
  )
}

export function useGetTmdbPersonCreditsApi(queries: Ref<TmdbPersonCreditsQueriesType>) {
  return useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_CREDITS,
        queries,
      ],
      queryFn: () => getTmdbPersonCreditsApi(queries.value),
    },
  )
}

export function useGetTmdbPersonExternalIdsApi(queries: Ref<TmdbDefaultQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_EXTERNAL_IDS,
      queries,
    ],
    queryFn: () => getTmdbPersonExternalIdsApi(queries.value),
  })
}

export function useGetTmdbRecommendationsApi(queries: Ref<TmdbDefaultQueriesType>) {
  return useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_RECOMMENDATIONS,
        queries,
      ],
      queryFn: () => getTmdbRecommendationsApi(queries.value),
    },
  )
}

export function useGetTmdbPopularListApi(queries: Ref<TmdbPopularQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_POPULAR,
      queries,
    ],
    queryFn: () => getTmdbPopularApi(queries.value),
  })
}

export function useGetTmdbSearchByTermApi(queries: Ref<TmdbSearchQueriesType>) {
  return useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_SEARCH,
        queries,
      ],
      queryFn: () => getTmdbSearchApi(queries.value),
    },
  )
}

export function useGetTmdbSearchMovieByTermApi(queries: Ref<TmdbSearchQueriesType>) {
  return useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_SEARCH_MOVIE,
        queries,
      ],
      queryFn: () => getTmdbSearchMovieApi(queries.value),
    },
  )
}

export function useGetTmdbSearchTvByTermApi(queries: Ref<TmdbSearchQueriesType>) {
  return useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_SEARCH_TV,
        queries,
      ],
      queryFn: () => getTmdbSearchTvApi(queries.value),
    },
  )
}

export function useGetTmdbSearchPersonByTermApi(queries: Ref<TmdbSearchQueriesType>) {
  return useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_SEARCH_PERSON,
        queries,
      ],
      queryFn: () => getTmdbSearchPersonApi(queries.value),
    },
  )
}

export function useGetTmdbVideosApi(queries: Ref<TmdbVideosQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_VIDEOS,
      queries,
    ],
    queryFn: () => getTmdbVideosApi(queries.value),
  })
}

export function useGetTmdbTvSeriesDetailsApi(queries: Ref<TmdbSeasonsQueriesType>, enabled?: Ref<boolean>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_SEASONS,
      queries,
    ],
    queryFn: () => getTmdbSeasonsApi(queries.value),
    enabled,
  })
}

export function useGetTmdbUpcomingMoviesApi(queries: Ref<TmdbUpcomingMoviesQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_UPCOMING_MOVIES,
      queries,
    ],
    queryFn: () => getTmdbUpcomingMoviesApi(queries.value),
  })
}

export function useGetTmdbTvOnTheAirApi(queries: Ref<TmdbTvOnTheAirQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_TV_ON_THE_AIR,
      queries,
    ],
    queryFn: () => getTmdbTvOnTheAirApi(queries.value),
  })
}

export function useGetTmdbTvAiringTodayApi(queries: Ref<TmdbTvAiringTodayQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_TV_AIRING_TODAY,
      queries,
    ],
    queryFn: () => getTmdbTvAiringTodayApi(queries.value),
  })
}

export function useGetTmdbDiscoverMovieApi(queries: Ref<TmdbDiscoverMovieQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DISCOVER_MOVIE,
      queries,
    ],
    queryFn: () => getTmdbDiscoverMovieApi(queries.value),
  })
}

export function useGetTmdbDiscoverTvApi(queries: Ref<TmdbDiscoverTvQueriesType>) {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DISCOVER_TV,
      queries,
    ],
    queryFn: () => getTmdbDiscoverTvApi(queries.value),
  })
}
