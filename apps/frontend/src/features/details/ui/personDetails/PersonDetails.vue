<script lang="ts" setup>
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import {
  useGetTmdbPersonCreditsApi,
  useGetTmdbPersonDetailsApi,
  useGetTmdbPersonExternalIdsApi
} from "~/api/tmdb/useTmdbApi";
import { computed } from "vue";
import { createError, useI18n } from "#imports";
import { UiContainer } from "~/components/newUi/UiContainer";
import PersonDetailsHeader from "~/features/details/ui/personDetails/PersonDetailsHeader.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiListWithShowMore from "~/components/ui/UiListWithShowMore.vue";
import { MovieCard } from "~/widgets/movieCard";
import { usePersonDetailsSeo } from "~/features/details/model/usePersonDetailsSeo";

interface PersonDetailsProps {
  mediaId: number;
}

const props = defineProps<PersonDetailsProps>();
const { locale, t } = useI18n();

const personQueries = computed(() => ({
  mediaType: TmdbMediaTypeEnum.PERSON,
  mediaId: props.mediaId,
  language: locale.value
}));

const creditsQueries = computed(() => ({
  personId: props.mediaId,
  language: locale.value
}));

const tmdbGetPersonDetailsApi = useGetTmdbPersonDetailsApi(personQueries);
const tmdbGetPersonCreditsApi = useGetTmdbPersonCreditsApi(creditsQueries);
const tmdbGetPersonExternalIdsApi = useGetTmdbPersonExternalIdsApi(personQueries);

await Promise.all([
  tmdbGetPersonDetailsApi.suspense().then((res) => {
    if (res.data === null) {
      throw createError({
        statusCode: 404,
        message: t("ui.errors.pageNotFound"),
      });
    }
  }),
  tmdbGetPersonCreditsApi.suspense(),
  tmdbGetPersonExternalIdsApi.suspense()
]);

const filmography = computed(() => {
  return [...(tmdbGetPersonCreditsApi.data.value?.cast || []), ...(tmdbGetPersonCreditsApi.data.value?.crew || [])];
});

usePersonDetailsSeo(tmdbGetPersonDetailsApi.data.value);
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <PersonDetailsHeader
      :details="tmdbGetPersonDetailsApi.data.value"
      :external-ids="tmdbGetPersonExternalIdsApi.data.value"
    />

    <section
      v-if="filmography.length"
      :class="$style.block"
    >
      <UiTypography
        as="h2"
        variant="title2"
      >
        {{ $t("details.filmography") }}
      </UiTypography>

      <UiListWithShowMore
        :items="filmography"
        :items-to-show="5"
        :title="$t('details.filmography')"
        variant="tripleColumns"
      >
        <template #card="{ item: movie, isFromModal }">
          <MovieCard
            :key="movie.id"
            :class="{ [$style.card]: !isFromModal }"
            :is-hide-media-list-selector="!isFromModal"
            :is-hide-score="!isFromModal"
            :is-horizontal="!isFromModal"
            :movie="movie"
          >
            <template
              v-if="'character' in movie && movie?.character"
              #default
            >
              <UiTypography>
                {{ $t("details.role") }}: {{ movie.character }}
              </UiTypography>
            </template>
            <template
              v-else-if="'job' in movie && movie?.job"
              #default
            >
              <UiTypography v-if="'job' in movie && movie?.job">
                {{ $t("details.role") }}: {{ movie.job }}
              </UiTypography>
            </template>
          </MovieCard>
        </template>
      </UiListWithShowMore>
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
    padding-top: 24px !important;
  }

  .card {
    height: 100% !important;
  }

  .block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
