<script setup lang="ts">
import type { TmdbMediaDetailsType, TmdbSeasonDetailsType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { EpisodeCardHorizontal } from "~/entities/episodeCard"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiListHeader } from "~/shared/ui/UiListHeader"
import { UiSelect } from "~/shared/ui/UiSelect"

interface TvDetailsSeasonsHeaderProps {
  details: TmdbMediaDetailsType
  seasons: TmdbSeasonDetailsType[]
}

const props = defineProps<TvDetailsSeasonsHeaderProps>()
const { t } = useI18n()
const selectedSeasonNumber = ref<string>("1")

const seasonsOptions = computed(() => {
  return props.seasons.map(season => ({
    label: season.name,
    value: season.season_number.toString(),
  }))
})

const selectedSeason = computed(() => {
  return props.seasons.find(season => season.season_number === Number(selectedSeasonNumber.value))
})

const subtitle = computed(() => {
  if (!props.seasons.length)
    return t("details.noSeasons")
  if (!selectedSeason.value?.episodes.length)
    return t("details.noEpisodes")

  return `${t("details.episodesCount")}: ${selectedSeason.value?.episodes.length}`
})
</script>

<template>
  <section>
    <UiListHeader
      :class="$style.header"
      :title="`${$t('details.listOfEpisodes')} ‘${props.details.title || props.details.name}’`"
      :subtitle="subtitle"
    >
      <template
        v-if="props.seasons.length"
        #controls
      >
        <UiSelect
          v-model="selectedSeasonNumber"
          :width="200"
          :options="seasonsOptions"
          :placeholder="$t('details.department.title')"
        />
      </template>
    </UiListHeader>

    <div
      v-if="selectedSeason?.episodes.length"
      :class="$style.list"
    >
      <template
        v-for="(episode, index) in selectedSeason?.episodes"
        :key="episode.id"
      >
        <EpisodeCardHorizontal
          :episode="episode"
        />
        <UiDivider
          v-if="index !== selectedSeason?.episodes.length - 1"
          :class="$style.line"
        />
      </template>
    </div>
  </section>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";

.header {
  margin-bottom: 16px;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > div:not(:hover) {
    background: none;
  }

  @include mobileDevice() {
    gap: 16px;

    .line {
      display: none;
    }
  }
}
</style>
