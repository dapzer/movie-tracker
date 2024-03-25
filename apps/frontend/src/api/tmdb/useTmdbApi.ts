import type { Ref } from "vue";
import {
  tmdbCreditsApi,
  tmdbDetailApi, tmdbPersonExternalIdsApi,
  tmdbPersonCreditsApi,
  tmdbRecommendationsApi,
  tmdbSearchApi,
  tmdbSeasonsApi,
  tmdbTrendsApi,
  tmdbVideosApi
} from "~/api/tmdb/tmdbApi";
import type {
  TmdbDefaultQueriesType,
  TmdbPersonCreditsQueriesType,
  TmdbSearchQueriesType,
  TmdbSeasonsQueriesType,
  TmdbTrendsQueriesType
} from "~/api/tmdb/tmdbApiTypes";
import { useQuery } from "@tanstack/vue-query";
import type { TmdbPersonType } from "@movie-tracker/types";
import { TmdbQueryKeys } from "~/api/tmdb/tmdbApiQueryKeys";

export const useTmdbGetMovieDetailsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DETAILS,
      queries
    ],
    queryFn: () => tmdbDetailApi(queries.value)
  });

export const useTmdbGetPersonDetailsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_DETAILS,
      queries
    ],
    queryFn: () => tmdbDetailApi<TmdbPersonType>(queries.value)
  });

export const useTmdbGetMovieCreditsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
      queryKey: [
        TmdbQueryKeys.GET_CREDITS,
        queries
      ],
      queryFn: () => tmdbCreditsApi(queries.value)
    }
  );

export const useTmdbGetPersonCreditsApi = (queries: Ref<TmdbPersonCreditsQueriesType>) =>
  useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_CREDITS,
        queries
      ],
      queryFn: () => tmdbPersonCreditsApi(queries.value)
    }
  );

export const useTmdbGetPersonExternalIdsApi = (queries: Ref<TmdbDefaultQueriesType>) => {
  return useQuery({
    queryKey: [
      TmdbQueryKeys.GET_EXTERNAL_IDS,
      queries
    ],
    queryFn: () => tmdbPersonExternalIdsApi(queries.value)
  });
}

export const useTmdbGetRecommendationsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_RECOMMENDATIONS,
        queries
      ],
      queryFn: () => tmdbRecommendationsApi(queries.value)
    }
  );

export const useTmdbGetPopularListApi = (queries: Ref<TmdbTrendsQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_TRENDS,
      queries
    ],
    queryFn: () => tmdbTrendsApi(queries.value)
  });

export const useTmdbGetSearchByTermApi = (queries: Ref<TmdbSearchQueriesType>) =>
  useQuery(
    {
      queryKey: [
        TmdbQueryKeys.GET_SEARCH,
        queries
      ],
      queryFn: () => tmdbSearchApi(queries.value)
    }
  );

export const useTmdbGetVideosApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_VIDEOS,
      queries
    ],
    queryFn: () => tmdbVideosApi(queries.value)
  });

export const useTmdbGetTvSeriesDetailsApi = (queries: Ref<TmdbSeasonsQueriesType>) =>
  useQuery({
    queryKey: [
      TmdbQueryKeys.GET_SEASONS,
      queries
    ],
    queryFn: () => tmdbSeasonsApi(queries.value)
  });
