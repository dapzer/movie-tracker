<script lang="ts" setup>
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import {
  useTmdbGetPersonCreditsApi,
  useTmdbGetPersonDetailsApi,
  useTmdbGetPersonExternalIdsApi
} from "~/composables/useTmdbApi";
import { computed } from "vue";
import { useI18n } from "#imports";
import UiContainer from "~/components/ui/UiContainer.vue";
import PersonDetailsHeader from "~/features/details/ui/personDetails/PersonDetailsHeader.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiListWithShowMore from "~/components/ui/UiListWithShowMore.vue";
import { MovieCard } from "~/widgets/movieCard";
import { usePersonDetailsSeo } from "~/features/details/model/usePersonDetailsSeo";

interface PersonDetailsProps {
  mediaId: number;
}

const props = defineProps<PersonDetailsProps>();
const { locale } = useI18n();

const personQueries = computed(() => ({
  mediaType: TmdbMediaTypeEnum.PERSON,
  mediaId: props.mediaId,
  language: locale.value
}));

const creditsQueries = computed(() => ({
  personId: props.mediaId,
  language: locale.value
}));

const tmdbGetPersonDetailsApi = useTmdbGetPersonDetailsApi(personQueries);
const tmdbGetPersonCreditsApi = useTmdbGetPersonCreditsApi(creditsQueries);
const tmdbGetPersonExternalIdsApi = useTmdbGetPersonExternalIdsApi(personQueries);

await Promise.all([
  tmdbGetPersonDetailsApi.suspense(),
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
      v-if="tmdbGetPersonDetailsApi.data.value?.biography"
      :class="$style.block"
    >
      <UiTypography
        as="h2"
        variant="title2"
      >
        {{ $t("details.biography") }}
      </UiTypography>

      <UiTypography :class="$style.overviev">
        {{ tmdbGetPersonDetailsApi.data.value?.biography }}
      </UiTypography>
    </section>
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
            <UiTypography v-if="'character' in movie && movie.character">
              {{ $t("details.role") }}: {{ movie.character }}
            </UiTypography>
            <UiTypography v-else-if="'job' in movie && movie.job">
              {{ $t("details.role") }}: {{ movie.job }}
            </UiTypography>
          </MovieCard>
        </template>
      </UiListWithShowMore>
    </section>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .card {
    height: 100% !important;
  }

  .block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .overview {
    white-space: pre-wrap;
  }
}
</style>
