import type { Ref } from "vue";
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
  getTmdbSeasonsApi,
  getTmdbTvAiringTodayApi,
  getTmdbTvOnTheAirApi,
  getTmdbUpcomingMoviesApi,
  getTmdbVideosApi
} from "~/api/tmdb/tmdbApi";
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
  TmdbVideosQueriesType
} from "~/api/tmdb/tmdbApiTypes";
import { useQuery } from "@tanstack/vue-query";
import type { TmdbPersonType } from "@movie-tracker/types";
import { TmdbQueryKeys } from "~/api/tmdb/tmdbApiQueryKeys";

export const useGetTmdbMovieDetailsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DETAILS,
      queries
    ],
    queryFn: () => getTmdbDetailApi(queries.value)
  });

export const useGetTmdbPersonDetailsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DETAILS,
      queries
    ],
    queryFn: () => getTmdbDetailApi<TmdbPersonType>(queries.value)
  });

export const useGetTmdbMovieCreditsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
      queryKey: [
        TmdbQueryKeys.GET_CREDITS,
        queries
      ],
      queryFn: () => getTmdbCreditsApi(queries.value)
    }
  );

export const useGetTmdbPersonCreditsApi = (queries: Ref<TmdbPersonCreditsQueriesType>) =>
  useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_CREDITS,
        queries
      ],
      queryFn: () => getTmdbPersonCreditsApi(queries.value)
    }
  );

export const useGetTmdbPersonExternalIdsApi = (queries: Ref<TmdbDefaultQueriesType>) => {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_EXTERNAL_IDS,
      queries
    ],
    queryFn: () => getTmdbPersonExternalIdsApi(queries.value)
  });
}

export const useGetTmdbRecommendationsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_RECOMMENDATIONS,
        queries
      ],
      queryFn: () => getTmdbRecommendationsApi(queries.value)
    }
  );

export const useGetTmdbPopularListApi = (queries: Ref<TmdbPopularQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_POPULAR,
      queries
    ],
    queryFn: () => getTmdbPopularApi(queries.value)
  });

export const useGetTmdbSearchByTermApi = (queries: Ref<TmdbSearchQueriesType>) =>
  useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_SEARCH,
        queries
      ],
      queryFn: () => getTmdbSearchApi(queries.value)
    }
  );

export const useGetTmdbVideosApi = (queries: Ref<TmdbVideosQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_VIDEOS,
      queries
    ],
    queryFn: () => getTmdbVideosApi(queries.value)
  });

export const useGetTmdbTvSeriesDetailsApi = (queries: Ref<TmdbSeasonsQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_SEASONS,
      queries
    ],
    queryFn: () => getTmdbSeasonsApi(queries.value)
  });

export const useGetTmdbUpcomingMoviesApi = (queries: Ref<TmdbUpcomingMoviesQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_UPCOMING_MOVIES,
      queries
    ],
    queryFn: () => getTmdbUpcomingMoviesApi(queries.value)
  });

export const useGetTmdbTvOnTheAirApi = (queries: Ref<TmdbTvOnTheAirQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_TV_ON_THE_AIR,
      queries
    ],
    queryFn: () => getTmdbTvOnTheAirApi(queries.value)
  });

export const useGetTmdbTvAiringTodayApi = (queries: Ref<TmdbTvAiringTodayQueriesType>) => {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_TV_AIRING_TODAY,
      queries
    ],
    queryFn: () => getTmdbTvAiringTodayApi(queries.value)
  });
}

export const useGetTmdbDiscoverMovieApi = (queries: Ref<TmdbDiscoverMovieQueriesType>) => {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DISCOVER_MOVIE,
      queries
    ],
    queryFn: () => getTmdbDiscoverMovieApi(queries.value)
  });
}

export const useGetTmdbDiscoverTvApi = (queries: Ref<TmdbDiscoverTvQueriesType>) => {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DISCOVER_TV,
      queries
    ],
    queryFn: () => getTmdbDiscoverTvApi(queries.value)
  });
}
