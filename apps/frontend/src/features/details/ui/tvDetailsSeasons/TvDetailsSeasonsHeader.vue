<script setup lang="ts">

import { getProxiedImageUrl } from "~/utils/getProxiedImageUrl"
import { UiInfoHeader } from "~/components/newUi/UiInfoHeader"
import { type TmdbMediaDetailsType, type TmdbSeasonDetailsType } from "@movie-tracker/types"
import { computed } from "#imports"
import { minsToTimeConverter } from "@movie-tracker/utils"
import MovieDetailsActions from "~/features/details/ui/MovieDetailsActions.vue"

interface TvDetailsSeasonsHeaderProps {
  details: TmdbMediaDetailsType;
  seriesDetails: TmdbSeasonDetailsType[];
}

const props = defineProps<TvDetailsSeasonsHeaderProps>();

const totalDuration = computed(() => {
  return minsToTimeConverter(
      props.seriesDetails.reduce((acc, season) => {
        season.episodes.forEach((el) => {
          acc += el.runtime;
        });

        return acc;
      }, 0) ?? 0
  );
});
</script>

<template>
  <UiInfoHeader
    poster-size="small"
    :description="$t(`details.mediaType.tv`)"
    :image="props.details?.poster_path && getProxiedImageUrl(props.details?.poster_path, 350)"
    fallback-image="/defaultMoviePoster.svg"
    :title="props.details.title || props.details.name"
  >
    <template #posterFooter>
      <MovieDetailsActions
        :class="$style.actionsMobile"
      />
    </template>
    <template #content>
      <MovieDetailsActions
        :class="$style.actionsPc"
      />
    </template>

    <template
      v-if="props.details"
      #tableItems
    >
      <tr>
        <td>{{ $t("details.seasonsCount") }}</td>
        <td>{{ props.details?.number_of_seasons }}</td>
      </tr>
      <tr>
        <td>{{ $t("details.episodesCount") }}</td>
        <td>{{ props.details?.number_of_episodes }}</td>
      </tr>
      <tr v-if="!!totalDuration.days || !!totalDuration.hours || !!totalDuration.minutes">
        <td>{{ $t("details.totalViewingTime") }}</td>
        <td>
          {{ totalDuration.days ? `${totalDuration.days} ${$t("ui.time.shortDay")}` : "" }}
          {{ totalDuration.hours ? `${totalDuration.hours} ${$t("ui.time.shortHour")}` : "" }}
          {{ totalDuration.minutes ? `${totalDuration.minutes} ${$t("ui.time.shortMin")}` : "" }}
        </td>
      </tr>
    </template>
  </UiInfoHeader>
</template>

<style module lang="scss">
@import "~/styles/newVariables";
@import "~/styles/mixins";

.actionsMobile {
  display: none !important;

  @include mobileDevice() {
    display: flex !important;
  }
}
.actionsPc {
  margin-top: auto;

  @include mobileDevice() {
    display: none !important;
  }
}
</style>
