<script setup lang="ts">
import type { TmdbDiscoverTvQueriesType } from "~/api/tmdb/tmdbApiTypes"
import { useLocalePath } from "#i18n"
import { computed, useI18n, useSeoMeta } from "#imports"
import { MediaTypeEnum, TmdbTvGenresEnum } from "@movie-tracker/types"
import { useRouteQuery } from "@vueuse/router"
import { useGetTmdbDiscoverTvApi } from "~/api/tmdb/useTmdbApi"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import { getNextThirtyDaysWithoutTime, getTodayWithoutTime } from "~/shared/constants/dates"
import { getTmdbTotalPages } from "~/shared/utils/getTmdbTotalPages"
import { ContentList } from "~/widgets/contentList"
import { UiAttention } from "../../shared/ui/UiAttention"
import { UiMediaCardSkeleton } from "../../shared/ui/UiCard"

const { locale, t } = useI18n()
const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const localePath = useLocalePath()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("feed.futureTv")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("feed.futureTv")}`
  },
})

const queries = computed<TmdbDiscoverTvQueriesType>(() => {
  return {
    "language": locale.value,
    "page": currentPage.value,
    "first_air_date.gte": getTodayWithoutTime(),
    "first_air_date.lte": getNextThirtyDaysWithoutTime(),
    "without_genres": [TmdbTvGenresEnum.NEWS, TmdbTvGenresEnum.WAR_POLITICS, TmdbTvGenresEnum.TALK, TmdbTvGenresEnum.REALITY].join(","),
  }
})

const getTmdbTvOnTheAirApi = useGetTmdbDiscoverTvApi(queries)
await getTmdbTvOnTheAirApi.suspense()

const results = computed(() => getTmdbTvOnTheAirApi.data?.value?.results)
const isFetching = computed(() => getTmdbTvOnTheAirApi.isFetching.value)
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('feed.futureTv')"
    :back-button-url="localePath('/')"
    :total-pages="getTmdbTotalPages(getTmdbTvOnTheAirApi.data?.value?.total_pages)"
    :get-page-href="(page) => page > 1 ? `?page=${page}` : localePath('')"
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
        :movie="{ ...item, media_type: MediaTypeEnum.TV }"
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
