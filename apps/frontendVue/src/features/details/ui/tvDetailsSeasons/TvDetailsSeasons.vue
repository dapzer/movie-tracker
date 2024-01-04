<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import { useTmdbGetMovieDetails, useTmdbGetTvSeriesDetails } from "~/composables/useTmdbApi";
import { computed, useI18n } from "#imports";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { minsToTimeConverter } from "@movie-tracker/utils";
import UiContainer from "~/components/ui/UiContainer.vue";
import { NuxtLink } from "#components";
import TvDetailsSeasonsItem from "./TvDetailsSeasonsItem.vue";
import { useLocalePath } from "#i18n";

interface TvDetailsSeasonsProps {
  mediaId: number;
}

const props = defineProps<TvDetailsSeasonsProps>();
const { locale } = useI18n();
const localePath = useLocalePath();

const queries = computed(() => ({
  mediaType: TmdbMediaTypeEnum.TV,
  mediaId: props.mediaId,
  language: locale.value
}));

const { data: seasons, suspense: suspenseSeasons } = useTmdbGetTvSeriesDetails(queries);
const { data: details, suspense: suspenseDetails } = useTmdbGetMovieDetails(queries);

await Promise.all([
  suspenseSeasons(),
  suspenseDetails()
]);

const totalDuration = computed(() => {
  return minsToTimeConverter(
    seasons?.value?.reduce((acc, season) => {
      season.episodes.forEach((el) => {
        acc += el.runtime;
      });

      return acc;
    }, 0) ?? 0
  );
});
</script>

<template>
  <UiContainer>
    <section>
      <UiTypography
        as="h1"
        variant="title2"
      >
        {{ $t("details.listOfEpisodes") }}
        <span>«</span>
        <UiTypography
          :as="NuxtLink"
          :class="$style.linkToTv"
          :to="localePath(`/details/${TmdbMediaTypeEnum.TV}/${props.mediaId}`)"
          variant="linkUnderlined"
        >
          {{ details?.title || details?.name }}
        </UiTypography>
        <span>»</span>
      </UiTypography>

      <ul :class="$style.infoList">
        <UiTypography
          as="li"
          variant="listItem"
        >
          {{ $t("details.seasonsCount") }}:
          <UiTypography
            as="span"
            variant="listItemValue"
          >
            {{ details?.number_of_seasons }}
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
            {{ details?.number_of_episodes }}
          </UiTypography>
        </UiTypography>

        <UiTypography
          v-if="!!totalDuration.days || !!totalDuration.hours || !!totalDuration.minutes"
          as="li"
          variant="listItem"
        >
          {{ $t("details.totalViewingTime") }}:
          <UiTypography
            as="span"
            variant="listItemValue"
          >
            {{ totalDuration.days ? `${totalDuration.days} ${$t("ui.time.shortDay")}` : "" }}
            {{ totalDuration.hours ? `${totalDuration.hours} ${$t("ui.time.shortHour")}` : "" }}
            {{ totalDuration.minutes ? `${totalDuration.minutes} ${$t("ui.time.shortMin")}` : "" }}
          </UiTypography>
        </UiTypography>
      </ul>
    </section>

    <section :class="$style.list">
      <TvDetailsSeasonsItem
        v-for="season in seasons"
        :key="season._id"
        :season="season"
      />
    </section>
  </UiContainer>
</template>

<style lang="scss" module>
.linkToTv {
  font-size: inherit;
  font-weight: inherit;
}

.infoList {
  display: flex;
  flex-direction: column;
  gap: 4px;
  padding-top: 16px;
  padding-bottom: 24px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
