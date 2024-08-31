<script setup lang="ts">

import { UiContainer } from "~/components/newUi/UiContainer"
import { computed, useI18n } from "#imports"
import { MediaTypeEnum, TmdbTvGenresEnum } from "@movie-tracker/types"
import { useGetTmdbDiscoverMovieApi, useGetTmdbDiscoverTvApi, useGetTmdbPopularListApi } from "~/api/tmdb/useTmdbApi"
import FeedItem from "~/widgets/feed/ui/FeedItem.vue"
import type { TmdbDiscoverMovieQueriesType, TmdbDiscoverTvQueriesType } from "~/api/tmdb/tmdbApiTypes"
import { MovieCard } from "~/entities/movieCard"
import { useLocalePath } from "#i18n"

const { locale } = useI18n();

const today = new Date().toISOString().split('T')[0];
const nextMonth = new Date(new Date().setMonth(new Date().getMonth() + 1)).toISOString().split('T')[0];
const localePath = useLocalePath()

const movieQueries = computed(() => {
  return {
    language: locale.value,
    page: 1,
    mediaType: MediaTypeEnum.MOVIE,
    timeWindow: 'week'
  };
});

const tvQueries = computed(() => {
  return {
    language: locale.value,
    page: 1,
    mediaType: MediaTypeEnum.TV,
    timeWindow: 'week'
  };
});

const upcomingMoviesQueries = computed<TmdbDiscoverMovieQueriesType>(() => {
  return {
    language: locale.value,
    page: 1,
    "primary_release_date.gte": today,
    "primary_release_date.lte": nextMonth,
    sort_by: 'popularity.desc',
  }
})

const tvOnTheAirQueries = computed<TmdbDiscoverTvQueriesType>(() => {
  return {
    language: locale.value,
    page: 1,
    "first_air_date.gte": today,
    "first_air_date.lte": nextMonth,
    without_genres: [TmdbTvGenresEnum.NEWS, TmdbTvGenresEnum.WAR_POLITICS, TmdbTvGenresEnum.TALK,
      TmdbTvGenresEnum.REALITY].join(','),
  }
})

const tvAiringTodayQueries = computed<TmdbDiscoverTvQueriesType>(() => {
  return {
    language: locale.value,
    page: 1,
    sort_by: 'popularity.desc',
    "air_date.gte": today,
    "air_date.lte": today,
    without_genres: [TmdbTvGenresEnum.NEWS, TmdbTvGenresEnum.WAR_POLITICS, TmdbTvGenresEnum.TALK,
      TmdbTvGenresEnum.REALITY].join(','),
  }
})

const getTmdbMoviePopularListApi = useGetTmdbPopularListApi(movieQueries);
const getTmdbTvPopularListApi = useGetTmdbPopularListApi(tvQueries);
const getTmdbUpcomingMoviesApi = useGetTmdbDiscoverMovieApi(upcomingMoviesQueries);
const getTmdbTvOnTheAirApi = useGetTmdbDiscoverTvApi(tvOnTheAirQueries);
const getTmdbTvAiringTodayApi = useGetTmdbDiscoverTvApi(tvAiringTodayQueries)

await Promise.all([
  getTmdbMoviePopularListApi.suspense(),
  getTmdbTvPopularListApi.suspense(),
  getTmdbUpcomingMoviesApi.suspense(),
  getTmdbTvOnTheAirApi.suspense(),
  getTmdbTvAiringTodayApi.suspense(),
]);
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <FeedItem
      :title="$t('feed.popularMovies')"
      :see-more-url="localePath('/popular/movies')"
      :data="getTmdbMoviePopularListApi.data.value?.results"
      :slide-width="195"
    >
      <template #slide="{item}">
        <MovieCard
          full-height
          :width="195"
          :movie="{...item, media_type: MediaTypeEnum.MOVIE}"
        />
      </template>
    </FeedItem>

    <FeedItem
      :title="$t('feed.popularTv')"
      :see-more-url="localePath('/popular/tv')"
      :data="getTmdbTvPopularListApi.data.value?.results"
      :slide-width="195"
    >
      <template #slide="{item}">
        <MovieCard
          full-height
          :width="195"
          :movie="{...item, media_type: MediaTypeEnum.TV}"
        />
      </template>
    </FeedItem>

    <FeedItem
      :title="$t('feed.futureReleases')"
      :see-more-url="localePath('/upcoming/movies')"
      :data="getTmdbUpcomingMoviesApi.data.value?.results"
      :slide-width="195"
    >
      <template #slide="{item}">
        <MovieCard
          full-height
          :width="195"
          :movie="{...item, media_type: MediaTypeEnum.MOVIE}"
        />
      </template>
    </FeedItem>

    <FeedItem
      :title="$t('feed.latestReleases')"
      :see-more-url="localePath('/airing/today')"
      :data="getTmdbTvAiringTodayApi.data.value?.results"
      :slide-width="195"
    >
      <template #slide="{item}">
        <MovieCard
          full-height
          :width="195"
          :movie="{...item, media_type: MediaTypeEnum.TV}"
        />
      </template>
    </FeedItem>

    <FeedItem
      :title="$t('feed.futureTv')"
      :see-more-url="localePath('/upcoming/tv')"
      :data="getTmdbTvOnTheAirApi.data.value?.results"
      :slide-width="195"
    >
      <template #slide="{item}">
        <MovieCard
          full-height
          :width="195"
          :movie="{...item, media_type: MediaTypeEnum.TV}"
        />
      </template>
    </FeedItem>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 70px;
}
</style>
