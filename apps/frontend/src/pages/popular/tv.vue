<script setup lang="ts">
import { useLocalePath } from "#i18n"
import { computed, useI18n, useSeoMeta } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { useRouteQuery } from "@vueuse/router"
import { useGetTmdbPopularListApi } from "~/api/tmdb/useTmdbApi"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
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

const queries = computed(() => {
  return {
    language: locale.value,
    mediaType: MediaTypeEnum.TV,
    page: currentPage.value,
    timeWindow: "week",
  }
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("feed.popularTv")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("feed.popularTv")}`
  },
})

const getTmdbMoviePopularListApi = useGetTmdbPopularListApi(queries)
await getTmdbMoviePopularListApi.suspense()

const results = computed(() => getTmdbMoviePopularListApi.data?.value?.results)
const isFetching = computed(() => getTmdbMoviePopularListApi.isFetching.value)
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('feed.popularTv')"
    :back-button-url="localePath('/')"
    :total-pages="getTmdbTotalPages(getTmdbMoviePopularListApi.data?.value?.total_pages)"
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
