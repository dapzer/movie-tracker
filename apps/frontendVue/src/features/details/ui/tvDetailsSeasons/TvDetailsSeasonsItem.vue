<script lang="ts" setup>
import type { TmdbSeasonDetailsType } from "@movie-tracker/types";
import UiDetails from "~/components/ui/UiDetails.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import { UiCard } from "~/components/ui/UiCard";
import { useI18n } from "#imports";
import UiSpoilerText from "~/components/ui/UiSpoilerText.vue";
import { getTmdbImageUrl } from "~/utils/getTmdbImageUrl";

interface TvDetailsSeasonsItemProps {
  season: TmdbSeasonDetailsType;
}

const props = defineProps<TvDetailsSeasonsItemProps>();
const { locale } = useI18n();
</script>

<template>
  <UiDetails
    :description="`${ $t('details.episodesCount') }: ${ props.season.episodes.length }`"
    :is-opened-default="props.season.season_number === 1"
    :title="props.season.name"
    is-large
  >
    <UiCard
      v-for="episode in props.season.episodes"
      :key="episode.id"
      :description="`${$t('details.releaseDate')}: ${new Date(episode.air_date).toLocaleDateString(locale)}`"
      :image="getTmdbImageUrl(episode?.still_path)"
      :title="episode.name"
      is-horizontal
    >
      <ul :class="$style.list">
        <UiTypography
          v-if="episode.vote_average"
          as="li"
          variant="listItem"
        >
          {{ $t("details.userScore") }}:
          <UiTypography
            as="span"
            variant="listItemValue"
          >
            {{ Number(episode.vote_average.toFixed(1)) }}
          </UiTypography>
        </UiTypography>

        <UiTypography
          as="li"
          variant="listItem"
        >
          {{ $t("details.episodeNumber") }}:
          <UiTypography
            as="span"
            variant="listItemValue"
          >
            {{ episode.episode_number }}
          </UiTypography>
        </UiTypography>

        <UiTypography
          as="li"
          variant="listItem"
        >
          {{ $t("details.episodeDuration") }}:
          <UiTypography
            as="span"
            variant="listItemValue"
          >
            {{ episode.runtime }} {{ $t("details.runTimeMins") }}
          </UiTypography>
        </UiTypography>

        <UiTypography
          as="li"
          variant="listItem"
        >
          {{ $t("details.episodeDescription") }}:
          <UiSpoilerText>
            <UiTypography
              as="span"
              variant="listItemValue"
            >
              {{ episode.overview }}
            </UiTypography>
          </UiSpoilerText>
        </UiTypography>
      </ul>
    </UiCard>
  </UiDetails>
</template>

<style lang="scss" module>
.list {
  display: flex;
  flex-direction: column;
  gap: 6px;
  margin-top: 12px;
}
</style>
