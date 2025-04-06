<script lang="ts" setup>
import { computed, createError, useI18n } from "#imports"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useGetTmdbMovieDetailsApi, useGetTmdbTvSeriesDetailsApi } from "~/api/tmdb/useTmdbApi"
import { UiContainer } from "~/shared/ui/UiContainer"
import { useMovieDetailsSeo } from "~/widgets/details/model/useMovieDetailsSeo"
import TvDetailsSeasonsEpisodeList from "~/widgets/details/ui/tvDetailsSeasons/TvDetailsSeasonsEpisodeList.vue"
import TvDetailsSeasonsHeader from "~/widgets/details/ui/tvDetailsSeasons/TvDetailsSeasonsHeader.vue"

interface TvDetailsSeasonsProps {
  mediaId: number
}

const props = defineProps<TvDetailsSeasonsProps>()
const { locale, t } = useI18n()

const queries = computed(() => ({
  mediaType: TmdbMediaTypeEnum.TV,
  mediaId: props.mediaId,
  language: locale.value,
}))

const tmdbGetTvSeriesDetailsApi = useGetTmdbTvSeriesDetailsApi(queries)
const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries)

await Promise.all([
  tmdbGetTvSeriesDetailsApi.suspense(),
  tmdbGetMovieDetailsApi.suspense().then((res) => {
    if (res.data === null) {
      throw createError({
        statusCode: 404,
        message: t("ui.errors.pageNotFound"),
      })
    }
  }),
])

useMovieDetailsSeo({
  mediaType: TmdbMediaTypeEnum.TV,
  mediaId: props.mediaId,
  withoutSchema: true,
  media: tmdbGetMovieDetailsApi.data.value,
  getTitle: (title, titleChink) => `${title} | ${t("details.episodesList")}${titleChink ? ` | ${titleChink}` : ""}`,
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <TvDetailsSeasonsHeader
      v-if="tmdbGetMovieDetailsApi.data.value && tmdbGetTvSeriesDetailsApi.data.value"
      :details="tmdbGetMovieDetailsApi.data.value"
      :series-details="tmdbGetTvSeriesDetailsApi.data.value"
    />

    <TvDetailsSeasonsEpisodeList
      v-if="tmdbGetMovieDetailsApi.data.value && tmdbGetTvSeriesDetailsApi.data.value"
      :details="tmdbGetMovieDetailsApi.data.value"
      :seasons="tmdbGetTvSeriesDetailsApi.data.value"
    />
  </UiContainer>
</template>

<style lang="scss" module>
@import "~/shared/styles/variables";
@import "~/shared/styles/mixins";

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
