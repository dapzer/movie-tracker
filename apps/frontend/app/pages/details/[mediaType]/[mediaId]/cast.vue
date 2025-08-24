<script setup lang="ts">
import { useLocalePath } from "#i18n"
import { computed, definePageMeta, useI18n } from "#imports"
import { useRoute } from "#vue-router"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { arrayToString } from "@movie-tracker/utils"
import { useRouteQuery } from "@vueuse/router"
import { useGetTmdbMovieCreditsApi, useGetTmdbMovieDetailsApi } from "~/api/tmdb/useTmdbApi"
import { PersonCard } from "~/entities/personCard"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiMediaCardSkeleton } from "~/shared/ui/UiCard"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getValidationForMediaDetailsParams } from "~/shared/utils/getValidationForMediaDetailsParams"
import { ContentList } from "~/widgets/contentList"
import { useMovieDetailsSeo } from "~/widgets/details/model/useMovieDetailsSeo"

definePageMeta({
  validate: getValidationForMediaDetailsParams([TmdbMediaTypeEnum.TV, TmdbMediaTypeEnum.MOVIE]),
})

const { locale, t } = useI18n()
const route = useRoute()
const mediaId = Number(route.params.mediaId)
const mediaType = route.params.mediaType as TmdbMediaTypeEnum
const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const localePath = useLocalePath()

const queries = computed(() => ({
  mediaType,
  mediaId,
  language: locale.value,
}))

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries)
const tmdbGetMovieCreditsApi = useGetTmdbMovieCreditsApi(queries)

await Promise.all([
  tmdbGetMovieDetailsApi.suspense(),
  tmdbGetMovieCreditsApi.suspense(),
])

useMovieDetailsSeo({
  withoutSchema: true,
  mediaId: Number(mediaId),
  mediaType,
  media: tmdbGetMovieDetailsApi?.data?.value,
  getTitle: (title, titleChunk) => `${title} | ${t("details.castTitle")}${titleChunk ? ` | ${titleChunk}` : ""}`,
})

const castList = computed(() => {
  if (!tmdbGetMovieCreditsApi.data?.value?.cast)
    return []
  return tmdbGetMovieCreditsApi.data.value.cast.slice((currentPage.value - 1) * 20, currentPage.value * 20)
})

const totalPages = computed(() => {
  return Math.ceil((tmdbGetMovieCreditsApi.data?.value?.cast.length || 0) / 20)
})
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('details.castTitle')"
    :back-button-url="localePath(`/details/${mediaType}/${mediaId}`)"
    :total-pages="totalPages"
    :get-page-href="(page) => page > 1 ? `?page=${page}` : localePath('')"
  >
    <template v-if="!tmdbGetMovieCreditsApi.isFetching.value">
      <PersonCard
        v-for="item in castList"
        :key="item.id"
        full-height
        :width="195"
        :person="item"
      >
        <template #content>
          <UiTypography
            v-if="item.character || item.roles"
            ellipsis
            variant="description"
          >
            {{ item.character || arrayToString(item.roles, 'character') }}
          </UiTypography>
        </template>
      </PersonCard>
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
      v-if="!tmdbGetMovieCreditsApi.isFetching.value && !castList.length"
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
