<script setup lang="ts">
import type { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useRoute } from "#app"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { useGetTmdbMovieDetailsApi, useGetTmdbRecommendationsApi } from "~/api/tmdb/useTmdbApi"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import { getTmdbTotalPages } from "~/utils/getTmdbTotalPages"
import { ContentList } from "~/widgets/contentList"
import { useMovieDetailsSeo } from "~/widgets/details/model/useMovieDetailsSeo"
import { UiAttention } from "../~/shared/ui/UiAttention"
import { UiMediaCardSkeleton } from "../~/shared/ui/UiCard"

const { locale, t } = useI18n()
const route = useRoute()
const mediaId = Number(route.params.mediaId)
const mediaType = route.params.mediaType as TmdbMediaTypeEnum
const currentPage = ref(Number(route.query.page) || 1)
const localePath = useLocalePath()

const queries = computed(() => ({
  mediaType,
  mediaId,
  language: locale.value,
}))

const recommendationsQueries = computed(() => ({
  ...queries.value,
  page: currentPage.value,
}))

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries)
const tmdbGetRecommendationsApi = useGetTmdbRecommendationsApi(recommendationsQueries)

await Promise.all([
  tmdbGetMovieDetailsApi.suspense(),
  tmdbGetRecommendationsApi.suspense(),
])

useMovieDetailsSeo({
  withoutSchema: true,
  mediaId: Number(mediaId),
  mediaType,
  media: tmdbGetMovieDetailsApi?.data?.value,
  getTitle: (title, titleChunk) => `${title} | ${t("details.recommendationsTitle")}${titleChunk ? ` | ${titleChunk}` : ""}`,
})

const results = computed(() => tmdbGetRecommendationsApi.data?.value?.results)
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('details.recommendationsTitle')"
    :back-button-url="localePath(`/details/${mediaType}/${mediaId}`)"
    :total-pages="getTmdbTotalPages(tmdbGetRecommendationsApi.data?.value?.total_pages)"
    :get-page-href="(page) => page > 1 ? `?page=${page}` : localePath('')"
  >
    <template v-if="!tmdbGetRecommendationsApi.isFetching.value">
      <MovieCardWithHoverMenu
        v-for="item in results"
        :key="item.id"
        full-height
        :width="195"
        :movie="item"
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
    <template
      v-if="!tmdbGetRecommendationsApi.isFetching.value && !results?.length"
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

<style scoped lang="scss">

</style>
