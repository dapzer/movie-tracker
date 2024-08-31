<script setup lang="ts">
import { useGetTmdbPopularListApi } from "~/api/tmdb/useTmdbApi"
import { computed, useI18n, useSeoMeta } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { MovieCard } from "~/entities/movieCard"
import { ref } from "vue"
import { ContentList } from "~/widgets/contentList"
import { useLocalePath } from "#i18n"
import { UiMediaCardSkeleton } from "~/components/newUi/UiCard"

const { locale, t } = useI18n();
const currentPage = ref(1)
const localePath = useLocalePath()

const tvQueries = computed(() => {
  return {
    language: locale.value,
    mediaType: MediaTypeEnum.TV,
    page: currentPage.value,
    timeWindow: 'week'
  };
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("feed.popularTv")} | ${titleChunk}`;
  },
  ogTitle() {
    return `%s | ${t("feed.popularTv")}`;
  },
})

const getTmdbMoviePopularListApi = useGetTmdbPopularListApi(tvQueries);
await getTmdbMoviePopularListApi.suspense();

const totalPages = computed(() => {
  return (getTmdbMoviePopularListApi.data?.value?.total_pages ?? 0) / 20;
})
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('feed.popularTv')"
    :back-button-url="localePath('/')"
    :total-pages="totalPages"
  >
    <template v-if="!getTmdbMoviePopularListApi.isFetching.value">
      <MovieCard
        v-for="item in getTmdbMoviePopularListApi.data?.value?.results"
        :key="item.id"
        full-height
        :width="195"
        :movie="{...item, media_type: MediaTypeEnum.TV}"
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
