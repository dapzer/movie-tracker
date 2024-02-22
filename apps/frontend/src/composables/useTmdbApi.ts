import type { Ref } from "vue";
import {
  tmdbCreditsApi,
  tmdbDetailApi,
  tmdbPersonCreditsApi,
  tmdbRecommendationsApi,
  tmdbSearchApi,
  tmdbSeasonsApi,
  tmdbTrendsApi,
  tmdbVideosApi
} from "~/api/tmdbApi";
import type {
  TmdbDefaultQueriesType,
  TmdbPersonCreditsQueriesType,
  TmdbSearchQueriesType,
  TmdbSeasonsQueriesType,
  TmdbTrendsQueriesType
} from "~/types/tmdbApiQueriesTypes";
import { useQuery } from "@tanstack/vue-query";
import type { TmdbPersonType, TmdbVideosType } from "@movie-tracker/types";

export const useTmdbGetMovieDetailsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      "getDetails",
      queries
    ],
    queryFn: () => tmdbDetailApi(queries.value)
  });

export const useTmdbGetPersonDetailsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      "getDetails",
      queries
    ],
    queryFn: () => tmdbDetailApi<TmdbPersonType>(queries.value)
  });

export const useTmdbGetMovieCreditsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
      queryKey: [
        "getCredits",
        queries
      ],
      queryFn: () => tmdbCreditsApi(queries.value)
    }
  );

export const useTmdbGetPersonCreditsApi = (queries: Ref<TmdbPersonCreditsQueriesType>) =>
  useQuery(
    {
      queryKey: [
        "getPersonCredits",
        queries
      ],
      queryFn: () => tmdbPersonCreditsApi(queries.value)
    }
  );

export const useTmdbGetRecommendationsApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery(
    {
      queryKey: [
        "getRecommendations",
        queries
      ],
      queryFn: () => tmdbRecommendationsApi(queries.value)
    }
  );

export const useTmdbGetPopularListApi = (queries: Ref<TmdbTrendsQueriesType>) =>
  useQuery({
    queryKey: [
      "getPopularList",
      queries
    ],
    queryFn: () => tmdbTrendsApi(queries.value)
  });

export const useTmdbGetSearchByTermApi = (queries: Ref<TmdbSearchQueriesType>) =>
  useQuery(
    {
      queryKey: [
        "getSearchByTerm",
        queries
      ],
      queryFn: () => tmdbSearchApi(queries.value)
    }
  );

export const useTmdbGetVideosApi = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      "getVideos",
      queries
    ],
    queryFn: () => tmdbVideosApi(queries.value)
  });

export const useTmdbGetTvSeriesDetailsApi = (queries: Ref<TmdbSeasonsQueriesType>) =>
  useQuery({
    queryKey: [
      "getTvSeriesDetails",
      queries
    ],
    queryFn: () => tmdbSeasonsApi(queries.value).then((data) => data?.seasons)
  });
