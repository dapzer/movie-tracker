<script setup lang="ts">
import type { MediaDetailsType, TvWatchCycleWithEpisodesType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import { useStartTvWatchCycleApi } from "~/api/tvWatchCycles/useTvWatchCyclesApi.ts"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDelimiter } from "~/shared/ui/UiDelimiter"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaCardManagementMenuTvProgressStateProps {
  mediaItemId: string
  mediaDetails: MediaDetailsType
  watchCycle: TvWatchCycleWithEpisodesType
}

const props = defineProps<MediaCardManagementMenuTvProgressStateProps>()
const { t } = useI18n()

const startTvWatchCycleApi = useStartTvWatchCycleApi()

const seasons = computed(() => {
  return props.mediaDetails.en.seasons
})

const totalEpisodes = computed(() => {
  if (!seasons.value?.length) {
    return 0
  }
  return seasons.value.reduce((acc, season) => acc + (season.episodeCount || 0), 0)
})

const continuedEpisode = computed<{ seasonNumber: number, episodeNumber: number } | null>(() => {
  if (!seasons.value?.length) {
    return null
  }

  const watches = props.watchCycle?.episodeWatches

  if (!watches?.length) {
    const firstSeason = seasons.value[0]
    const firstEpisode = firstSeason?.episodeCount ? 1 : null

    if (!firstSeason || !firstEpisode) {
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

const progressPercentage = computed(() => {
  if (!totalEpisodes.value) {
    return 0
  }

  const watchedEpisodesCount = props.watchCycle.episodeWatches.length
  return (watchedEpisodesCount / totalEpisodes.value) * 100
})

async function handleStartNewCycle() {
  await startTvWatchCycleApi.mutateAsync({
    mediaItemId: props.mediaItemId,
  }).then(() => {
    toast.success(t("toasts.mediaItem.successNewCycleStarted"))
  }).catch(() => {
    toast.error(t("toasts.mediaItem.unsuccessfullyNewCycleStarted"))
  })
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.row">
      <div :class="$style.watchedEpisodes">
        <UiTypography
          :class="$style.watchedEpisodesTitle"
          variant="label"
        >
          <UiTypography
            as="span"
            variant="title4"
          >
            {{ props.watchCycle.episodeWatches.length }}
          </UiTypography>/{{ totalEpisodes }} {{ $t("mediaItem.managementMenu.tvProgress.episodes") }}
        </UiTypography>
        <UiDelimiter />
        <UiTypography
          :class="$style.progressPercentage"
          variant="label"
        >
          {{ progressPercentage.toFixed(0) }}%
        </UiTypography>
      </div>
      <UiTypography
        :class="$style.cycles"
        variant="description"
      >
        <UiIcon
          name="icon:cycle"
          :size="16"
        />
        {{ $t("mediaItem.managementMenu.tvProgress.fullWatches") }}: {{ props.watchCycle.cycleNumber - 1 }}
      </UiTypography>
    </div>
    <div
      :class="$style.progressLine"
      :style="{ '--progress': `${progressPercentage}%` }"
    />
    <div :class="$style.row">
      <UiTypography>
        <template v-if="continuedEpisode">
          {{ $t("mediaItem.managementMenu.tvProgress.continueFrom") }} S{{ continuedEpisode.seasonNumber }} E{{ continuedEpisode.episodeNumber }}
        </template>
      </UiTypography>
      <UiButton
        variant="text"
        scheme="link"
        :disabled="props.watchCycle.episodeWatches.length === 0 || startTvWatchCycleApi.isPending.value"
        @click="handleStartNewCycle"
      >
        {{ $t("mediaItem.managementMenu.tvProgress.startNewCycle") }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.watchedEpisodes {
  display: flex;
  align-items: center;
  gap: 8px;
}

.watchedEpisodesTitle {
  color: var(--c-text-secondary);
}

.progressPercentage {
  color: var(--c-label-secondary);
}

.cycles {
  display: flex;
  align-items: center;
  gap: 4px;
  color: var(--c-description);
}

.progressLine {
  height: 10px;
  background-color: var(--c-white-10);
  border-radius: var(--s-border-radius-small);
  position: relative;

  &::after {
    content: "";
    position: absolute;
    top: 1px;
    left: 1px;
    height: 8px;
    width: var(--progress, 0%);
    background-color: var(--c-button-background-primary);
    border-radius: var(--s-border-radius-small);
    transition: width 0.3s ease;
  }
}
</style>
