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

export const useTmdbGetMovieDetails = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      "getDetails",
      queries
    ],
    queryFn: () => tmdbDetailApi(queries.value)
  });

export const useTmdbGetPersonDetails = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      "getDetails",
      queries
    ],
    queryFn: () => tmdbDetailApi<TmdbPersonType>(queries.value)
  });

export const useTmdbGetMovieCredits = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
      queryKey: [
        "getCredits",
        queries
      ],
      queryFn: () => tmdbCreditsApi(queries.value)
    }
  );

export const useTmdbGetPersonCredits = (queries: Ref<TmdbPersonCreditsQueriesType>) =>
  useQuery(
    {
      queryKey: [
        "getPersonCredits",
        queries
      ],
      queryFn: () => tmdbPersonCreditsApi(queries.value)
    }
  );

export const useTmdbGetRecommendations = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery(
    {
      queryKey: [
        "getRecommendations",
        queries
      ],
      queryFn: () => tmdbRecommendationsApi(queries.value)
    }
  );

export const useTmdbGetPopularList = (queries: Ref<TmdbTrendsQueriesType>) =>
  useQuery({
    queryKey: [
      "getPopularList",
      queries
    ],
    queryFn: () => tmdbTrendsApi(queries.value)
  });

export const useTmdbGetSearchByTerm = (queries: Ref<TmdbSearchQueriesType>) =>
  useQuery(
    {
      queryKey: [
        "getSearchByTerm",
        queries
      ],
      queryFn: () => tmdbSearchApi(queries.value)
    }
  );

export const useTmdbGetVideos = (queries: Ref<TmdbDefaultQueriesType>) =>
  useQuery({
    queryKey: [
      "getVideos",
      queries
    ],
    queryFn: () => tmdbVideosApi(queries.value),
    select: (data: TmdbVideosType | null) => {
      if (!data) return null;
      data.results = data.results.sort((a, b) => (a.type === "Trailer" || a.type === "Teaser" ? -1 : 1));
      return data;
    }
  });

export const useTmdbGetTvSeriesDetails = (queries: Ref<TmdbSeasonsQueriesType>) =>
  useQuery({
    queryKey: [
      "getTvSeriesDetails",
      queries
    ],
    queryFn: () => tmdbSeasonsApi(queries.value).then((data) => data?.seasons)
  });
