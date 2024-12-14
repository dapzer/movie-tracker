<script setup lang="ts">
import { useGetTmdbDiscoverTvApi } from "~/api/tmdb/useTmdbApi"
import { computed, useI18n, useSeoMeta } from "#imports"
import { MediaTypeEnum, TmdbTvGenresEnum } from "@movie-tracker/types"
import { ref } from "vue"
import { ContentList } from "~/widgets/contentList"
import { useLocalePath } from "#i18n"
import { UiMediaCardSkeleton } from "~/components/ui/UiCard"
import type { TmdbDiscoverTvQueriesType } from "~/api/tmdb/tmdbApiTypes"
import { getTodayWithoutTime } from "~/shared/constants/dates"
import { getTmdbTotalPages } from "~/utils/getTmdbTotalPages"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import { useRoute } from "#app"
import { UiAttention } from "~/components/ui/UiAttention"

const { locale, t } = useI18n();
const route = useRoute()
const currentPage = ref(Number(route.query.page) || 1)
const localePath = useLocalePath()

const queries = computed<TmdbDiscoverTvQueriesType>(() => {
  return {
    language: locale.value,
    page: currentPage.value,
    sort_by: 'popularity.desc',
    "air_date.gte": getTodayWithoutTime(),
    "air_date.lte": getTodayWithoutTime(),
    without_genres: [TmdbTvGenresEnum.NEWS, TmdbTvGenresEnum.WAR_POLITICS, TmdbTvGenresEnum.TALK,
      TmdbTvGenresEnum.REALITY].join(','),
  }
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("feed.latestReleases")} | ${titleChunk}`;
  },
  ogTitle() {
    return `%s | ${t("feed.latestReleases")}`;
  },
})

const getTmdbTvAiringTodayApi = useGetTmdbDiscoverTvApi(queries);
await getTmdbTvAiringTodayApi.suspense();

const results = computed(() => getTmdbTvAiringTodayApi.data?.value?.results)
const isFetching = computed(() => getTmdbTvAiringTodayApi.isFetching.value)
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('feed.latestReleases')"
    :back-button-url="localePath('/')"
    :total-pages="getTmdbTotalPages(getTmdbTvAiringTodayApi.data?.value?.total_pages)"
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
        :movie="{...item, media_type: MediaTypeEnum.TV}"
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
