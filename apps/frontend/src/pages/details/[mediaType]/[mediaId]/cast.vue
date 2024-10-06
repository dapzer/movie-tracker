<script setup lang="ts">

import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { computed, useI18n } from "#imports"
import { ref } from "vue"
import { useLocalePath } from "#i18n"
import { useGetTmdbMovieCreditsApi, useGetTmdbMovieDetailsApi } from "~/api/tmdb/useTmdbApi"
import { useRoute } from "#vue-router"
import { useMovieDetailsSeo } from "~/features/details/model/useMovieDetailsSeo"
import { PersonCard } from "~/entities/personCard"
import { UiMediaCardSkeleton } from "~/components/newUi/UiCard"
import { ContentList } from "~/widgets/contentList"
import { UiTypography } from "~/components/newUi/UiTypography"

const { locale, t } = useI18n();
const route = useRoute();
const mediaId = computed(() => Number(route.params.mediaId));
const mediaType = computed(() => route.params.mediaType as TmdbMediaTypeEnum);
const currentPage = ref(1)
const localePath = useLocalePath()

const queries = computed(() => ({
  mediaType: mediaType.value,
  mediaId: mediaId.value,
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
  mediaId: Number(mediaId.value),
  mediaType: mediaType.value,
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
            v-if="item.character"
            ellipsis
            variant="description"
          >
            {{ item.character }}
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
  </ContentList>
</template>

<style scoped lang="scss">

</style>
