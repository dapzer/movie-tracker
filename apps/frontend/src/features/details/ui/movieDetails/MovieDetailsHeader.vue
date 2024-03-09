<script lang="ts" setup>

import UiInfoHeader from "~/components/ui/UiInfoHeader.vue";
import type { TmdbCreditsType, TmdbMediaDetailsType } from "@movie-tracker/types";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import UiTypography from "~/components/ui/UiTypography.vue";
import { arrayToString, convertNumberToCurrency, getMovieDirectors } from "@movie-tracker/utils";
import { computed } from "vue";
import MovieDetailsProducers from "./MovieDetailsProducers.vue";
import { getProxiedImageUrl, useI18n } from "#imports";
import { useLocalePath } from "#i18n";
import { NuxtLink } from "#components";
import { MediaListSelectorModal } from "~/features/mediaListSelector";
import { checkIsValidDate } from "~/utils/checkIsValidDate";

interface MovieDetailsHeaderProps {
  details?: TmdbMediaDetailsType | null;
  mediaType?: TmdbMediaTypeEnum;
  credits?: TmdbCreditsType | null;
}

const props = defineProps<MovieDetailsHeaderProps>();
const { locale } = useI18n();
const localePath = useLocalePath();

const producers = computed(() => {
  if (!props.credits || props.mediaType !== TmdbMediaTypeEnum.MOVIE) return [];
  return getMovieDirectors(props.credits.crew);
});

const releaseDate = computed(() => {
  if (!props.details) return "";
  const date = new Date(props.details?.release_date || props.details?.first_air_date).toLocaleDateString(locale.value);

  return checkIsValidDate(date) ? date : "";
});

const isShowOriginalTitle = computed(() => {
  if (!props.details) return false;
  return (props.details?.original_title || props.details?.original_name) !== (props.details?.title || props.details?.name);
});

const title = computed(() => {
  if (!props.details) return "";
  return props.details?.title || props.details?.name;
});
</script>

<template>
  <UiInfoHeader
    :description="isShowOriginalTitle ? props.details?.original_title || props.details?.original_name : ''"
    :image="getProxiedImageUrl(props.details?.poster_path, 350)"
    :title="title ?`${title} (${$t(`details.mediaType.${props.mediaType}`).toLowerCase()})` : ''"
  >
    <template
      v-if="props.details && props.mediaType"
      #posterFooter
    >
      <MediaListSelectorModal
        :media-id="props.details?.id"
        :media-type="props.mediaType"
      />
    </template>


    <UiTypography
      v-if="props.details?.vote_average"
      as="li"
      variant="listItem"
    >
      {{ $t("details.userScore") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ Number(props.details.vote_average.toFixed(1)) }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="!!props.details?.production_countries?.length || !!props.details?.origin_country?.length"
      as="li"
      variant="listItem"
    >
      {{ $t("details.productionCountry") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ arrayToString(props.details?.production_countries, "name") || arrayToString(props.details?.origin_country) }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="producers.length"
      as="li"
      variant="listItem"
    >
      {{ $t("details.producer") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        <MovieDetailsProducers :producers="producers" />
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="props.details?.created_by?.length"
      as="li"
      variant="listItem"
    >
      {{ $t("details.creator") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        <MovieDetailsProducers :producers="props.details?.created_by" />
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="props.details?.production_companies?.length"
      as="li"
      variant="listItem"
    >
      {{ $t("details.productionCompanies") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ arrayToString(props.details.production_companies, "name") }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="props.details?.genres?.length"
      as="li"
      variant="listItem"
    >
      {{ $t("details.genre") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ arrayToString(props.details.genres, "name") }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="props.details?.budget"
      as="li"
      variant="listItem"
    >
      {{ $t("details.budget") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ convertNumberToCurrency(props.details.budget, "USD", locale) }}
      </UiTypography>
    </UiTypography>

    <UiTypography
      v-if="releaseDate"
      as="li"
      variant="listItem"
    >
      {{ $t("details.releaseDate") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ releaseDate }}
      </UiTypography>
    </UiTypography>

    <template v-if="props.mediaType === TmdbMediaTypeEnum.TV">
      <UiTypography
        v-if="props.details?.last_air_date"
        as="li"
        variant="listItem"
      >
        {{ $t("details.lastAirDate") }}:
        <UiTypography
          as="span"
          variant="listItemValue"
        >
          {{ new Date(props.details.last_air_date).toLocaleDateString(locale) }}
        </UiTypography>
      </UiTypography>

      <UiTypography
        as="li"
        variant="listItem"
      >
        {{ $t("details.seriesStatus") }}:
        <UiTypography
          as="span"
          variant="listItemValue"
        >
          {{ $t(`details.seriesStatusName.${props.details?.status.toLowerCase()}`) }}
        </UiTypography>
      </UiTypography>

      <UiTypography
        as="li"
        variant="listItem"
      >
        {{ $t("details.seasonsCount") }}:
        <UiTypography
          as="span"
          variant="listItemValue"
        >
          {{ props.details?.number_of_seasons }} (
          <UiTypography
            :as="NuxtLink"
            :to="localePath(`/details/${TmdbMediaTypeEnum.TV}/${props.details?.id}/seasons`)"
            variant="linkUnderlined"
          >
            {{ $t("details.episodesList") }}
          </UiTypography>
          )
        </UiTypography>
      </UiTypography>

      <UiTypography
        as="li"
        variant="listItem"
      >
        {{ $t("details.episodesCount") }}:
        <UiTypography
          as="span"
          variant="listItemValue"
        >
          {{ props.details?.number_of_episodes }}
        </UiTypography>
      </UiTypography>
    </template>

    <UiTypography
      v-if="!!props.details?.runtime || !!props.details?.episode_run_time?.length"
      as="li"
      variant="listItem"
    >
      {{ $t("details.runTime") }}:
      <UiTypography
        as="span"
        variant="listItemValue"
      >
        {{ props.details?.runtime || arrayToString(props.details?.episode_run_time) }} {{ $t("details.runTimeMins") }}
      </UiTypography>
    </UiTypography>
  </UiInfoHeader>
</template>

<style lang="scss" module>
</style>
