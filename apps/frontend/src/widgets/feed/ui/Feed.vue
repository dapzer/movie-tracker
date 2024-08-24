<script setup lang="ts">

import { UiContainer } from "~/components/newUi/UiContainer"
import { computed, useI18n } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { useGetTmdbPopularListApi } from "~/api/tmdb/useTmdbApi"
import FeedItem from "~/widgets/feed/ui/FeedItem.vue"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"

const { locale } = useI18n();

const movieQueries = computed(() => {
  return {
    language: locale.value,
    mediaType: MediaTypeEnum.MOVIE,
    timeWindow: 'week'
  };
});

const tvQueries = computed(() => {
  return {
    language: locale.value,
    mediaType: MediaTypeEnum.TV,
    timeWindow: 'week'
  };
});

const tmdbGetMoviePopularListApi = useGetTmdbPopularListApi(movieQueries);
const tmdbGetTVPopularListApi = useGetTmdbPopularListApi(tvQueries);

await Promise.all([
  tmdbGetMoviePopularListApi.suspense(),
  tmdbGetTVPopularListApi.suspense()
]);
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <FeedItem
      :title="$t('feed.popularMovies')"
      :data="tmdbGetMoviePopularListApi.data.value?.results"
      :slide-width="195"
    >
      <template #slide="{item}">
        <MovieCardWithHoverMenu
          :class="$style.card"
          :width="195"
          :movie="{...item, media_type: MediaTypeEnum.MOVIE}"
        />
      </template>
    </FeedItem>
    <FeedItem
      :title="$t('feed.popularTv')"
      :data="tmdbGetTVPopularListApi.data.value?.results"
      :slide-width="195"
    >
      <template #slide="{item}">
        <MovieCardWithHoverMenu
          :class="$style.card"
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

  .card {
    height: 100%;
  }
}
</style>
