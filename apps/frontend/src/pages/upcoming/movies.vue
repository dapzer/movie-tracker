<script setup lang="ts">
import { useGetTmdbDiscoverMovieApi } from "~/api/tmdb/useTmdbApi"
import { computed, useI18n, useSeoMeta } from "#imports"
import { ref } from "vue"
import { ContentList } from "~/widgets/contentList"
import { useLocalePath } from "#i18n"
import { UiMediaCardSkeleton } from "~/components/ui/UiCard"
import type { TmdbDiscoverMovieQueriesType } from "~/api/tmdb/tmdbApiTypes"
import { getNextThirtyDaysWithoutTime, getTodayWithoutTime } from "~/shared/constants/dates"
import { getTmdbTotalPages } from "~/utils/getTmdbTotalPages"
import { MediaTypeEnum } from "@movie-tracker/types"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import { useRoute } from "#app"
import { UiAttention } from "~/components/ui/UiAttention"

const { locale, t } = useI18n();
const route = useRoute()
const currentPage = ref(Number(route.query.page) || 1)
const localePath = useLocalePath()

const queries = computed<TmdbDiscoverMovieQueriesType>(() => {
  return {
    language: locale.value,
    page: currentPage.value,
    "primary_release_date.gte": getTodayWithoutTime(),
    "primary_release_date.lte": getNextThirtyDaysWithoutTime(),
    sort_by: 'popularity.desc',
  }
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("feed.futureReleases")} | ${titleChunk}`;
  },
  ogTitle() {
    return `%s | ${t("feed.futureReleases")}`;
  },
})

const getTmdbUpcomingMoviesApi = useGetTmdbDiscoverMovieApi(queries);
await getTmdbUpcomingMoviesApi.suspense();

const results = computed(() => getTmdbUpcomingMoviesApi.data?.value?.results)
const isFetching = computed(() => getTmdbUpcomingMoviesApi.isFetching.value)
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('feed.futureReleases')"
    :back-button-url="localePath('/')"
    :total-pages="getTmdbTotalPages(getTmdbUpcomingMoviesApi.data?.value?.total_pages)"
    :get-page-href="(page) => page > 1 ? `?page=${page}`: localePath('')"
  >
    <template v-if="isFetching">
      <UiMediaCardSkeleton
        v-for="index in 20"
        :key="index"
        full-height
        :width="195"
      />
    </template>
    <template v-else-if="results?.length">
      <MovieCardWithHoverMenu
        v-for="item in results"
        :key="item.id"
        full-height
        :width="195"
        :movie="{...item, media_type: MediaTypeEnum.MOVIE}"
      />
    </template>
    <template
      v-if="!results?.length && !isFetching"
      #plainContent
    >
      <UiAttention
        title-variant="text"
        :indent="0"
        :title="$t('search.notingFound')"
      />
    </template>
  </ContentList>
</template>

<style module lang="scss">
</style>
