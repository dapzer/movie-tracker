<script setup lang="ts">
import type { GetRecentlyCreatedMediaRatingsArgs } from "~/api/mediaRating/mediaRatingApiTypes"
import type { TmdbDiscoverMovieQueriesType, TmdbDiscoverTvQueriesType } from "~/api/tmdb/tmdbApiTypes"
import { useLocalePath } from "#i18n"
import { computed, useI18n } from "#imports"
import { MediaTypeEnum, TmdbTvGenresEnum } from "@movie-tracker/types"
import { useMediaRatingsGetRecentlyCreatedApi } from "~/api/mediaRating/useMediaRatingApi"
import { useGetTmdbDiscoverMovieApi, useGetTmdbDiscoverTvApi, useGetTmdbPopularListApi } from "~/api/tmdb/useTmdbApi"
import { MediaRatingCardWithHoverMenu } from "~/features/mediaRatingCardWithHoverMenu"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import { getNextThirtyDaysWithoutTime, getTodayWithoutTime } from "~/shared/constants/dates"
import { UiMediaCardSkeleton } from "~/shared/ui/UiCard"
import { UiContainer } from "~/shared/ui/UiContainer"
import FeedItem from "~/widgets/feed/ui/FeedItem.vue"

const { locale } = useI18n()
const localePath = useLocalePath()

const movieQueries = computed(() => {
  return {
    language: locale.value,
    page: 1,
    mediaType: MediaTypeEnum.MOVIE,
    timeWindow: "week",
  }
})

const tvQueries = computed(() => {
  return {
    language: locale.value,
    page: 1,
    mediaType: MediaTypeEnum.TV,
    timeWindow: "week",
  }
})

const upcomingMoviesQueries = computed<TmdbDiscoverMovieQueriesType>(() => {
  return {
    "language": locale.value,
    "page": 1,
    "primary_release_date.gte": getTodayWithoutTime(),
    "primary_release_date.lte": getNextThirtyDaysWithoutTime(),
    "sort_by": "popularity.desc",
  }
})

const tvOnTheAirQueries = computed<TmdbDiscoverTvQueriesType>(() => {
  return {
    "language": locale.value,
    "page": 1,
    "first_air_date.gte": getTodayWithoutTime(),
    "first_air_date.lte": getNextThirtyDaysWithoutTime(),
    "without_genres": [TmdbTvGenresEnum.NEWS, TmdbTvGenresEnum.WAR_POLITICS, TmdbTvGenresEnum.TALK, TmdbTvGenresEnum.REALITY].join(","),
  }
})

const tvAiringTodayQueries = computed<TmdbDiscoverTvQueriesType>(() => {
  return {
    "language": locale.value,
    "page": 1,
    "sort_by": "popularity.desc",
    "air_date.gte": getTodayWithoutTime(),
    "air_date.lte": getTodayWithoutTime(),
    "without_genres": [TmdbTvGenresEnum.NEWS, TmdbTvGenresEnum.WAR_POLITICS, TmdbTvGenresEnum.TALK, TmdbTvGenresEnum.REALITY].join(","),
  }
})

const mediaRatingQueries = computed<GetRecentlyCreatedMediaRatingsArgs>(() => {
  return {
    limit: 20,
    offset: 0,
  }
})

const getTmdbMoviePopularListApi = useGetTmdbPopularListApi(movieQueries)
const getTmdbTvPopularListApi = useGetTmdbPopularListApi(tvQueries)
const getTmdbUpcomingMoviesApi = useGetTmdbDiscoverMovieApi(upcomingMoviesQueries)
const getTmdbTvOnTheAirApi = useGetTmdbDiscoverTvApi(tvOnTheAirQueries)
const getTmdbTvAiringTodayApi = useGetTmdbDiscoverTvApi(tvAiringTodayQueries)
const getMediaRatingsGetRecentlyCreatedApi = useMediaRatingsGetRecentlyCreatedApi(mediaRatingQueries)

await Promise.all([
  getTmdbMoviePopularListApi.suspense(),
  getTmdbTvPopularListApi.suspense(),
  getTmdbUpcomingMoviesApi.suspense(),
  getTmdbTvOnTheAirApi.suspense(),
  getTmdbTvAiringTodayApi.suspense(),
  getMediaRatingsGetRecentlyCreatedApi.suspense(),
])
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <FeedItem
      :title="$t('feed.popularMovies')"
      :see-more-url="localePath('/popular/movies')"
      :data=" getTmdbMoviePopularListApi.data.value?.results"
      :is-loading="getTmdbMoviePopularListApi.isPending.value"
      :slide-width="195"
    >
      <template #slide="{ item }">
        <MovieCardWithHoverMenu
          full-height
          :width="195"
          :movie="{ ...item, media_type: MediaTypeEnum.MOVIE }"
        />
      </template>
      <template #skeleton>
        <UiMediaCardSkeleton :width="195" />
      </template>
    </FeedItem>

    <FeedItem
      :title="$t('feed.popularTv')"
      :see-more-url="localePath('/popular/tv')"
      :data="getTmdbTvPopularListApi.data.value?.results"
      :is-loading="getTmdbTvPopularListApi.isPending.value"
      :slide-width="195"
    >
      <template #slide="{ item }">
        <MovieCardWithHoverMenu
          full-height
          :width="195"
          :movie="{ ...item, media_type: MediaTypeEnum.TV }"
        />
      </template>

      <template #skeleton>
        <UiMediaCardSkeleton :width="195" />
      </template>
    </FeedItem>

    <FeedItem
      :title="$t('feed.recentlyRated')"
      :see-more-url="localePath('/recently-rated')"
      :data="getMediaRatingsGetRecentlyCreatedApi.data.value?.items"
      :is-loading="getMediaRatingsGetRecentlyCreatedApi.isPending.value"
      :slide-width="195"
    >
      <template #slide="{ item }">
        <MediaRatingCardWithHoverMenu
          v-if="item.user"
          :media-rating="item"
          :user="item.user"
          full-height
          :width="195"
        />
      </template>

      <template #skeleton>
        <UiMediaCardSkeleton :width="195" />
      </template>
    </FeedItem>

    <FeedItem
      :title="$t('feed.futureReleases')"
      :see-more-url="localePath('/upcoming/movies')"
      :data="getTmdbUpcomingMoviesApi.data.value?.results"
      :is-loading="getTmdbUpcomingMoviesApi.isPending.value"
      :slide-width="195"
    >
      <template #slide="{ item }">
        <MovieCardWithHoverMenu
          full-height
          :width="195"
          :movie="{ ...item, media_type: MediaTypeEnum.MOVIE }"
        />
      </template>

      <template #skeleton>
        <UiMediaCardSkeleton :width="195" />
      </template>
    </FeedItem>

    <FeedItem
      :title="$t('feed.latestReleases')"
      :see-more-url="localePath('/airing/today')"
      :data="getTmdbTvAiringTodayApi.data.value?.results"
      :is-loading="getTmdbTvAiringTodayApi.isPending.value"
      :slide-width="195"
    >
      <template #slide="{ item }">
        <MovieCardWithHoverMenu
          full-height
          :width="195"
          :movie="{ ...item, media_type: MediaTypeEnum.TV }"
        />
      </template>

      <template #skeleton>
        <UiMediaCardSkeleton :width="195" />
      </template>
    </FeedItem>

    <FeedItem
      :title="$t('feed.futureTv')"
      :see-more-url="localePath('/upcoming/tv')"
      :data="getTmdbTvOnTheAirApi.data.value?.results"
      :is-loading="getTmdbTvOnTheAirApi.isPending.value"
      :slide-width="195"
    >
      <template #slide="{ item }">
        <MovieCardWithHoverMenu
          full-height
          :width="195"
          :movie="{ ...item, media_type: MediaTypeEnum.TV }"
        />
      </template>

      <template #skeleton>
        <UiMediaCardSkeleton :width="195" />
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
