<script setup lang="ts">

import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { computed, useI18n } from "#imports"
import { ref } from "vue"
import { useLocalePath } from "#i18n"
import { useGetTmdbMovieCreditsApi, useGetTmdbMovieDetailsApi } from "~/api/tmdb/useTmdbApi"
import { useRoute } from "#vue-router"
import { useMovieDetailsSeo } from "~/widgets/details/model/useMovieDetailsSeo"
import { PersonCard } from "~/entities/personCard"
import { UiMediaCardSkeleton } from "~/components/ui/UiCard"
import { ContentList } from "~/widgets/contentList"
import { UiTypography } from "~/components/ui/UiTypography"
import { arrayToString } from "@movie-tracker/utils"
import { UiAttention } from "~/components/ui/UiAttention"

const { locale, t } = useI18n();
const route = useRoute();
const mediaId = Number(route.params.mediaId);
const mediaType = route.params.mediaType as TmdbMediaTypeEnum;
const currentPage = ref(Number(route.query.page) || 1)
const localePath = useLocalePath()

const queries = computed(() => ({
  mediaType: mediaType,
  mediaId: mediaId,
  language: locale.value
}));

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries);
const tmdbGetMovieCreditsApi = useGetTmdbMovieCreditsApi(queries);

await Promise.all([
  tmdbGetMovieDetailsApi.suspense(),
  tmdbGetMovieCreditsApi.suspense()
]);

useMovieDetailsSeo({
  withoutSchema: true,
  mediaId: Number(mediaId),
  mediaType: mediaType,
  media: tmdbGetMovieDetailsApi?.data?.value,
  getTitle: (title, titleChunk) => `${title} | ${t("details.castTitle")}${titleChunk ? ` | ${titleChunk}`: ""}`,
});

const castList = computed(() => {
  if (!tmdbGetMovieCreditsApi.data?.value?.cast) return []
  return tmdbGetMovieCreditsApi.data.value.cast.slice((currentPage.value - 1) * 20, currentPage.value * 20)
});

const totalPages = computed(() => {
  return Math.ceil((tmdbGetMovieCreditsApi.data?.value?.cast.length || 0) / 20)
});
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('details.castTitle')"
    :back-button-url="localePath(`/details/${mediaType}/${mediaId}`)"
    :total-pages="totalPages"
    :get-page-href="(page) => page > 1 ? `?page=${page}`: localePath('')"
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
