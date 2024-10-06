<script lang="ts" setup>

import { useGetTmdbMovieDetailsApi, useGetTmdbTvSeriesDetailsApi } from "~/api/tmdb/useTmdbApi";
import { computed, createError, useI18n } from "#imports";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import UiContainer from "~/components/ui/UiContainer.vue";
import TvDetailsSeasonsItem from "./TvDetailsSeasonsItem.vue";
import { useLocalePath } from "#i18n";
import { useMovieDetailsSeo } from "~/features/details/model/useMovieDetailsSeo"
import TvDetailsSeasonsHeader from "~/features/details/ui/tvDetailsSeasons/TvDetailsSeasonsHeader.vue"

interface TvDetailsSeasonsProps {
  mediaId: number;
}

const props = defineProps<TvDetailsSeasonsProps>();
const { locale, t } = useI18n();
const localePath = useLocalePath();

const queries = computed(() => ({
  mediaType: TmdbMediaTypeEnum.TV,
  mediaId: props.mediaId,
  language: locale.value
}));

const tmdbGetTvSeriesDetailsApi = useGetTmdbTvSeriesDetailsApi(queries);
const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries);

await Promise.all([
  tmdbGetTvSeriesDetailsApi.suspense(),
  tmdbGetMovieDetailsApi.suspense().then((res) => {
    if (res.data === null) {
      throw createError({
        statusCode: 404,
        message: t("ui.errors.pageNotFound"),
      });
    }
  }),
]);

useMovieDetailsSeo({
  mediaType: TmdbMediaTypeEnum.TV,
  mediaId: props.mediaId,
  withoutSchema: true,
  media: tmdbGetMovieDetailsApi.data.value,
  getTitle: (title, titleChink) => `${title} | ${t("details.episodesList")}${titleChink? ` | ${titleChink}` : ""}`,
});
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <TvDetailsSeasonsHeader
      v-if="tmdbGetMovieDetailsApi.data.value && tmdbGetTvSeriesDetailsApi.data.value"
      :details="tmdbGetMovieDetailsApi.data.value"
      :series-details="tmdbGetTvSeriesDetailsApi.data.value"
    />

    <section :class="$style.list">
      <TvDetailsSeasonsItem
        v-for="season in tmdbGetTvSeriesDetailsApi.data?.value"
        :key="season._id"
        :season="season"
      />
    </section>
  </UiContainer>
</template>

<style lang="scss" module>
@import "~/styles/newVariables";
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 70px;
  padding-top: 50px !important;

  @include mobileDevice() {
    padding-top: 0 !important;
  }
}

.linkToTv {
  font-size: inherit;
  font-weight: inherit;
}

.infoList {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 16px;
  padding-bottom: 24px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
