<script setup lang="ts">
import { useGetTmdbDiscoverTvApi } from "~/api/tmdb/useTmdbApi"
import { computed, useI18n, useSeoMeta } from "#imports"
import { MediaTypeEnum, TmdbTvGenresEnum } from "@movie-tracker/types"
import { ref } from "vue"
import { ContentList } from "~/widgets/contentList"
import { useLocalePath } from "#i18n"
import { UiMediaCardSkeleton } from "~/components/newUi/UiCard"
import type { TmdbDiscoverTvQueriesType } from "~/api/tmdb/tmdbApiTypes"
import { todayWithoutTime } from "~/shared/constants/dates"
import { getTmdbTotalPages } from "~/utils/getTmdbTotalPages"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"

const { locale, t } = useI18n();
const currentPage = ref(1)
const localePath = useLocalePath()

const queries = computed<TmdbDiscoverTvQueriesType>(() => {
  return {
    language: locale.value,
    page: currentPage.value,
    sort_by: 'popularity.desc',
    "air_date.gte": todayWithoutTime,
    "air_date.lte": todayWithoutTime,
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
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('feed.latestReleases')"
    :back-button-url="localePath('/')"
    :total-pages="getTmdbTotalPages(getTmdbTvAiringTodayApi.data?.value?.total_pages)"
  >
    <template v-if="!getTmdbTvAiringTodayApi.isFetching.value">
      <MovieCardWithHoverMenu
        v-for="item in getTmdbTvAiringTodayApi.data?.value?.results"
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
