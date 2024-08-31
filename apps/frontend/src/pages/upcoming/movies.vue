<script setup lang="ts">
import { useGetTmdbDiscoverMovieApi } from "~/api/tmdb/useTmdbApi"
import { computed, useI18n, useSeoMeta } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { MovieCard } from "~/entities/movieCard"
import { ref } from "vue"
import { ContentList } from "~/widgets/contentList"
import { useLocalePath } from "#i18n"
import { UiMediaCardSkeleton } from "~/components/newUi/UiCard"
import type { TmdbDiscoverMovieQueriesType } from "~/api/tmdb/tmdbApiTypes"
import { nextThirtyDaysWithoutTime, todayWithoutTime } from "~/shared/constants/dates"
import { getTmdbTotalPages } from "~/utils/getTmdbTotalPages"

const { locale, t } = useI18n();
const currentPage = ref(1)
const localePath = useLocalePath()

const queries = computed<TmdbDiscoverMovieQueriesType>(() => {
  return {
    language: locale.value,
    page: currentPage.value,
    "primary_release_date.gte": todayWithoutTime,
    "primary_release_date.lte": nextThirtyDaysWithoutTime,
    sort_by: 'popularity.desc',
  }
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("feed.popularMovies")} | ${titleChunk}`;
  },
  ogTitle() {
    return `%s | ${t("feed.popularMovies")}`;
  },
})

const getTmdbUpcomingMoviesApi = useGetTmdbDiscoverMovieApi(queries);
await getTmdbUpcomingMoviesApi.suspense();
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('feed.popularMovies')"
    :back-button-url="localePath('/')"
    :total-pages="getTmdbTotalPages(getTmdbUpcomingMoviesApi.data?.value?.total_pages)"
  >
    <template v-if="!getTmdbUpcomingMoviesApi.isFetching.value">
      <MovieCard
        v-for="item in getTmdbUpcomingMoviesApi.data?.value?.results"
        :key="item.id"
        full-height
        :width="195"
        :movie="{...item, media_type: MediaTypeEnum.MOVIE}"
      />
    </template>
    <template v-else>
      <UiMediaCardSkeleton
        v-for="index in 20"
        :key="index"
        full-height
        :width="195"
      />
    </template>
  </ContentList>
</template>

<style module lang="scss">
</style>
