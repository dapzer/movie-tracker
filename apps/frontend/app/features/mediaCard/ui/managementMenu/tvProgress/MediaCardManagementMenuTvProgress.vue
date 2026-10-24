<script setup lang="ts">
import type { MediaDetailsType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { useGetActiveTvWatchCycleByMediaItemIdApi } from "~/api/tvWatchCycles/useTvWatchCyclesApi.ts"
import MediaCardManagementMenuTvProgressEpisode
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressEpisode.vue"
import MediaCardManagementMenuTvProgressSeason
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressSeason.vue"
import MediaCardManagementMenuTvProgressSkeleton
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressSkeleton.vue"
import MediaCardManagementMenuTvProgressState
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressState.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiDivider } from "~/shared/ui/UiDivider"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails.ts"

interface MediaCardManagementMenuTvProgressProps {
  mediaItemId: string
  mediaDetails: MediaDetailsType
}

const props = defineProps<MediaCardManagementMenuTvProgressProps>()
const { t, locale } = useI18n()

const getActiveTvWatchCycleByMediaItemIdApi = useGetActiveTvWatchCycleByMediaItemIdApi({
  mediaItemId: props.mediaItemId,
})

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaDetails, locale.value)
})

const seasons = computed(() => {
  const seasons = props.mediaDetails.en.seasons

  if (seasons?.some(season => season.seasonNumber !== 0)) {
    return seasons.filter(season => season.seasonNumber !== 0)
  }

  return seasons
})

const continuedEpisode = computed<{ seasonNumber: number, episodeNumber: number } | null>(() => {
  const watches = getActiveTvWatchCycleByMediaItemIdApi.data.value?.episodeWatches.filter(
    episodeWatch => seasons.value?.some(season => season.seasonNumber === episodeWatch.seasonNumber),
  )

  if (!seasons.value?.length || !watches) {
    return null
  }

  if (!watches.length) {
    const firstSeason = seasons.value[0]

    if (!firstSeason?.episodeCount) {
      return null
    }

    return {
      seasonNumber: firstSeason.seasonNumber,
      episodeNumber: 1,
    }
  }

  const maxWatchedEpisode = watches.reduce((max, episodeWatch) => {
    const isSameSeason = episodeWatch.seasonNumber === max.seasonNumber
    const isHigherEpisode = episodeWatch.episodeNumber > max.episodeNumber
    const isHigherSeason = episodeWatch.seasonNumber > max.seasonNumber

    if (isHigherSeason || (isSameSeason && isHigherEpisode)) {
      return episodeWatch
    }

    return max
  })

  const seasonIndex = seasons.value.findIndex(
    season => season.seasonNumber === maxWatchedEpisode.seasonNumber,
  )
  if (seasonIndex === -1) {
    return null
  }

  const season = seasons.value[seasonIndex]
  if (!season) {
    return null
  }

  if (maxWatchedEpisode.episodeNumber < season.episodeCount) {
    return {
      seasonNumber: season.seasonNumber,
      episodeNumber: maxWatchedEpisode.episodeNumber + 1,
    }
  }

  const nextSeason = seasons.value[seasonIndex + 1]
  if (nextSeason?.episodeCount) {
    return {
      seasonNumber: nextSeason.seasonNumber,
      episodeNumber: 1,
    }
  }

  return null
})
</script>

<template>
  <MediaCardManagementMenuTvProgressSkeleton
    v-if="getActiveTvWatchCycleByMediaItemIdApi.isLoading.value"
    :season-count="currentMediaDetails?.seasons?.length"
  />
  <div
    v-else-if="getActiveTvWatchCycleByMediaItemIdApi.data.value"
    :class="$style.wrapper"
  >
    <MediaCardManagementMenuTvProgressState
      :continued-episode="continuedEpisode"
      :media-item-id="props.mediaItemId"
      :media-details="props.mediaDetails"
      :watch-cycle="getActiveTvWatchCycleByMediaItemIdApi.data.value"
    />
    <UiDivider />
    <div :class="$style.seasons">
      <UiAttention
        v-if="!currentMediaDetails?.seasons?.length"
        :indent="0"
        title-variant="text"
        :title="t('mediaItem.managementMenu.tvProgress.noSeasons')"
      />
      <MediaCardManagementMenuTvProgressSeason
        v-for="season in currentMediaDetails?.seasons"
        :key="season.seasonNumber"
        :continued-episode="continuedEpisode"
        :season="season"
        :watch-cycle="getActiveTvWatchCycleByMediaItemIdApi.data.value"
      >
        <MediaCardManagementMenuTvProgressEpisode
          v-for="episode in season.episodes"
          :key="`${episode.seasonNumber}-${episode.episodeNumber}`"
          :episode="episode"
          :season-episodes="season.episodes"
          :watch-cycle="getActiveTvWatchCycleByMediaItemIdApi.data.value"
        />
        <UiAttention
          v-if="!season.episodes?.length"
          :indent="0"
          title-variant="text"
          :title="t('mediaItem.managementMenu.tvProgress.noEpisodes')"
        />
      </MediaCardManagementMenuTvProgressSeason>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.seasons {
  display: flex;
  flex-direction: column;
  gap: 16px;
  max-height: 472px;
  overflow-y: auto;
}
</style>
