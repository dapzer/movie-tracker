<script lang="ts" setup>

import { UiInfoHeader } from "~/components/newUi/UiInfoHeader";
import type { TmdbCreditsType, TmdbMediaDetailsType } from "@movie-tracker/types";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { arrayToString, convertNumberToCurrency, getMovieDirectors } from "@movie-tracker/utils";
import { computed } from "vue";
import MovieDetailsProducers from "./MovieDetailsProducers.vue";
import { getProxiedImageUrl, useI18n } from "#imports";
import { useLocalePath } from "#i18n";
import { NuxtLink } from "#components";
import { checkIsValidDate } from "~/utils/checkIsValidDate";
import { ListIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/newUi/UiButton"
import { UiRating } from "~/components/newUi/UiRating"

interface MovieDetailsHeaderProps {
  details?: TmdbMediaDetailsType | null;
  mediaType?: TmdbMediaTypeEnum;
  credits?: TmdbCreditsType | null;
  overview?: string;
}

const props = defineProps<MovieDetailsHeaderProps>();
const { locale, t } = useI18n();
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

// const isShowOriginalTitle = computed(() => {
//   if (!props.details) return false;
//   return (props.details?.original_title || props.details?.original_name) !== (props.details?.title || props.details?.name);
// });

const title = computed(() => {
  if (!props.details) return "";
  return props.details?.title || props.details?.name;
});

</script>

<template>
  <UiInfoHeader
    :description="$t(`details.mediaType.${props.mediaType}`)"
    :image="props.details?.poster_path && getProxiedImageUrl(props.details?.poster_path, 350)"
    fallback-image="/defaultMoviePoster.svg"
    :title="title"
    :overview="props.overview"
  >
    <template
      v-if="props.details && props.mediaType"
      #posterFooter
    >
      <UiButton
        :class="$style.addToListButton"
        variant="boxed"
      >
        <ListIcon />
        {{ $t('mediaList.addToList') }}
      </UiButton>
    </template>

    <template
      v-if="props.details"
      #tableItems
    >
      <tr>
        <td>{{ $t("details.title") }}</td>
        <td>{{ props.details?.original_title || props.details?.original_name }}</td>
      </tr>
      <tr>
        <td>{{ $t("details.userScore") }}</td>
        <td><UiRating :value="props.details?.vote_average" /></td>
      </tr>
      <tr>
        <td>{{ $t("details.releaseDate") }}</td>
        <td>{{ releaseDate }}</td>
      </tr>
      <template v-if="props.mediaType === TmdbMediaTypeEnum.TV">
        <tr>
          <td>{{ $t("details.lastAirDate") }}</td>
          <td>{{ new Date(props.details.last_air_date).toLocaleDateString(locale) }}</td>
        </tr>
        <tr v-if="props.details.next_episode_to_air?.air_date">
          <td>{{ $t("details.nextAirDate") }}</td>
          <td>{{ new Date(props.details.next_episode_to_air?.air_date).toLocaleDateString(locale) }}</td>
        </tr>
      </template>
      <tr v-if="props.details?.genres">
        <td>{{ $t("details.genre") }}</td>
        <td>{{ arrayToString(props.details.genres, "name") }}</td>
      </tr>
      <tr v-if="producers.length">
        <td>{{ $t("details.director") }}</td>
        <td><MovieDetailsProducers :producers="producers" /></td>
      </tr>
      <tr v-if="props.details?.created_by?.length">
        <td>{{ $t("details.director") }}</td>
        <td><MovieDetailsProducers :producers="props.details?.created_by" /></td>
      </tr>
      <tr v-if="!!props.details?.production_countries?.length || !!props.details?.origin_country?.length">
        <td>{{ $t("details.productionCountry") }}</td>
        <td>{{ arrayToString(props.details?.production_countries, "name") || arrayToString(props.details?.origin_country) }}</td>
      </tr>
      <tr v-if="props.details?.production_companies?.length">
        <td>{{ $t("details.productionCompanies") }}</td>
        <td>{{ arrayToString(props.details.production_companies, "name") }}</td>
      </tr>
      <tr v-if="props.details?.budget">
        <td>{{ $t("details.budget") }}</td>
        <td>{{ convertNumberToCurrency(props.details.budget, "USD", locale) }}</td>
      </tr>
      <tr v-if="props.details?.revenue">
        <td>{{ $t("details.revenue") }}</td>
        <td>{{ convertNumberToCurrency(props.details.revenue, "USD", locale) }}</td>
      </tr>
      <template v-if="props.mediaType === TmdbMediaTypeEnum.TV">
        <tr v-if="props.details?.status">
          <td>{{ $t("details.seriesStatus") }}</td>
          <td>{{ $t(`details.seriesStatusName.${props.details?.status.toLowerCase()}`) }}</td>
        </tr>
        <tr>
          <td>{{ $t("details.seasonsCount") }}</td>
          <td>
            {{ props.details?.number_of_seasons }} <NuxtLink :to="localePath(`/details/${TmdbMediaTypeEnum.TV}/${props.details?.id}/seasons`)">
              ({{ $t("details.episodesList") }})
            </NuxtLink>
          </td>
        </tr>
        <tr>
          <td>{{ $t("details.episodesCount") }}</td>
          <td>{{ props.details?.number_of_episodes }}</td>
        </tr>
      </template>
      <tr v-if="!!props.details?.runtime || !!props.details?.episode_run_time?.length">
        <td>{{ $t("details.runTime") }}</td>
        <td>{{ props.details?.runtime || arrayToString(props.details?.episode_run_time) }} {{ $t("details.runTimeMins") }}</td>
      </tr>
    </template>
  </UiInfoHeader>
</template>

<style lang="scss" module>
.addToListButton {
  width: 100% !important;
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 2px;
  font-size: var(--fs-label-small);
}
</style>
