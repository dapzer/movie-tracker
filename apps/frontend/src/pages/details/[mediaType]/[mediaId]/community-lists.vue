<script setup lang="ts">
import type { GetCommunityListsWithMediaQueries, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useRoute } from "#app"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useCommunityListsWithMediaApi } from "~/api/communityLists/useCommunityListsApi"
import { useGetTmdbMovieDetailsApi } from "~/api/tmdb/useTmdbApi"
import { CommunityListsDetails } from "~/widgets/communityLists"
import { useMovieDetailsSeo } from "~/widgets/details/model/useMovieDetailsSeo"

const { locale, t } = useI18n()
const route = useRoute()
const mediaId = Number(route.params.mediaId)
const mediaType = route.params.mediaType as TmdbMediaTypeEnum
const localePath = useLocalePath()

const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const searchTerm = useRouteQuery<string>("searchTerm", "", {
  mode: "replace",
})

const queries = computed(() => ({
  mediaType,
  mediaId,
  language: locale.value,
}))
const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries)

const getCommunityListsWithMediaQueries = computed<GetCommunityListsWithMediaQueries>(() => ({
  mediaId,
  limit: 20,
  offset: (currentPage.value - 1) * 20,
  title: searchTerm.value,
}))
const communityListsWithMediaApi = useCommunityListsWithMediaApi(getCommunityListsWithMediaQueries)

watch([searchTerm], () => {
  currentPage.value = 1
})

await Promise.all([
  communityListsWithMediaApi.suspense(),
  tmdbGetMovieDetailsApi.suspense(),
])

useMovieDetailsSeo({
  withoutSchema: true,
  mediaId: Number(mediaId),
  mediaType,
  media: tmdbGetMovieDetailsApi?.data?.value,
  getTitle: (title, titleChunk) => `${title} | ${t("details.listsWithMediaTitle")}${titleChunk ? ` | ${titleChunk}` : ""}`,
})
</script>

<template>
  <CommunityListsDetails
    v-model:current-page="currentPage"
    v-model:search-term="searchTerm"
    :back-button-url="localePath(`/details/${mediaType}/${mediaId}`)"
    :title="$t('details.listsWithMediaTitle')"
    :is-loading="communityListsWithMediaApi.isFetching.value"
    :lists="communityListsWithMediaApi.data?.value?.items || []"
    :total-count="communityListsWithMediaApi.data?.value?.totalCount || 0"
  />
</template>

<style scoped lang="scss">

</style>
