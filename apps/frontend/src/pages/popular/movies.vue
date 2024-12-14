<script setup lang="ts">
import { useGetTmdbPopularListApi } from "~/api/tmdb/useTmdbApi"
import { computed, useI18n, useSeoMeta } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { ref } from "vue"
import { ContentList } from "~/widgets/contentList"
import { useLocalePath } from "#i18n"
import { UiMediaCardSkeleton } from "~/components/ui/UiCard"
import { getTmdbTotalPages } from "~/utils/getTmdbTotalPages"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import { useRoute } from "#app"
import { UiAttention } from "~/components/ui/UiAttention"

const { locale, t } = useI18n();
const route = useRoute()
const currentPage = ref(Number(route.query.page) || 1)
const localePath = useLocalePath()

const queries = computed(() => {
  return {
    language: locale.value,
    mediaType: MediaTypeEnum.MOVIE,
    page: currentPage.value,
    timeWindow: 'week'
  };
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("feed.popularMovies")} | ${titleChunk}`;
  },
  ogTitle() {
    return `%s | ${t("feed.popularMovies")}`;
  },
})

const getTmdbMoviePopularListApi = useGetTmdbPopularListApi(queries);
await getTmdbMoviePopularListApi.suspense();

const results = computed(() => getTmdbMoviePopularListApi.data?.value?.results)
const isFetching = computed(() => getTmdbMoviePopularListApi.isFetching.value)
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('feed.popularMovies')"
    :back-button-url="localePath('/')"
    :total-pages="getTmdbTotalPages(getTmdbMoviePopularListApi.data?.value?.total_pages)"
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
