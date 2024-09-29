<script lang="ts" setup>
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import {
  useGetTmdbPersonCreditsApi,
  useGetTmdbPersonDetailsApi,
  useGetTmdbPersonExternalIdsApi
} from "~/api/tmdb/useTmdbApi";
import { computed } from "vue";
import { createError, formatDate, useI18n } from "#imports";
import { UiContainer } from "~/components/newUi/UiContainer";
import PersonDetailsHeader from "~/features/details/ui/personDetails/PersonDetailsHeader.vue";
import { usePersonDetailsSeo } from "~/features/details/model/usePersonDetailsSeo";
import { UiSlider } from "~/components/newUi/UiSlider"
import { UiSectionWithSeeMore } from "~/components/newUi/UiSectionWithSeeMore"
import { MovieCardHorizontal } from "~/entities/movieCard"
import { UiTypography } from "~/components/newUi/UiTypography"
import PersonDetailsActing from "~/features/details/ui/personDetails/PersonDetailsActing.vue"

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

const knowFor = computed(() => {
  if (!tmdbGetPersonCreditsApi.data.value) return [];

  return [...tmdbGetPersonCreditsApi.data.value.cast].sort((a, b) => b.vote_count - a.vote_count).slice(0, 20);
});

usePersonDetailsSeo(tmdbGetPersonDetailsApi.data.value);
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <PersonDetailsHeader
      :details="tmdbGetPersonDetailsApi.data.value"
      :external-ids="tmdbGetPersonExternalIdsApi.data.value"
    />

    <UiSectionWithSeeMore
      v-if="knowFor.length"
      :title="$t(`details.knowFor.title`)"
      hide-see-more
    >
      <UiSlider
        :class="$style.slider"
        :data="knowFor"
        :max-width="294"
      >
        <template #slide="{item}">
          <MovieCardHorizontal
            full-height
            :movie="item"
            :image-width="89"
            :sub-description="formatDate(item.release_date || item.first_air_date, locale)"
          >
            <template #description>
              <UiTypography
                ellipsis
                variant="description"
              >
                {{ item.character }}
              </UiTypography>
            </template>
          </MovieCardHorizontal>
        </template>
      </UiSlider>

      <div :class="$style.knowForMobile">
        <MovieCardHorizontal
          v-for="item in knowFor.slice(0, 6)"
          :key="item.id"
          :movie="item"
          :image-width="80"
          :sub-description="formatDate(item.release_date || item.first_air_date, locale)"
        >
          <template #description>
            <UiTypography
              ellipsis
              variant="description"
            >
              {{ item.character }}
            </UiTypography>
          </template>
        </MovieCardHorizontal>
      </div>
    </UiSectionWithSeeMore>

    <PersonDetailsActing
      v-if="tmdbGetPersonCreditsApi.data.value?.crew?.length || tmdbGetPersonCreditsApi.data?.value?.cast.length"
      :crew="tmdbGetPersonCreditsApi.data.value.crew"
      :cast="tmdbGetPersonCreditsApi.data.value.cast"
    />
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

  .slider {
    @include mobileDevice() {
      display: none;
    }
  }

  .knowForMobile {
    display: none;

    @include mobileDevice() {
      display: flex;
      flex-direction: column;
    }
  }
}
</style>
