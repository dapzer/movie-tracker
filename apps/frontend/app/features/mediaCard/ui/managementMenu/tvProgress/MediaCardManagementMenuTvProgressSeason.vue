<script setup lang="ts">
import type { MediaDetailsInfoSeasonType, TvWatchCycleWithEpisodesType } from "@movie-tracker/types"
import { computed, onMounted, ref } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaCardManagementMenuTvProgressSeasonProps {
  continuedEpisode: { seasonNumber: number, episodeNumber: number } | null
  season: MediaDetailsInfoSeasonType
  watchCycle: TvWatchCycleWithEpisodesType
}

const props = defineProps<MediaCardManagementMenuTvProgressSeasonProps>()

const open = ref(props.continuedEpisode?.seasonNumber === props.season.seasonNumber)
const seasonRef = ref<HTMLElement | null>(null)

onMounted(() => {
  if (open.value) {
    seasonRef.value?.scrollIntoView({ block: "start" })
  }
})

function handleToggleOpen() {
  open.value = !open.value
}

const watchedEpisodes = computed(() => {
  return props.watchCycle.episodeWatches.filter(
    episodeWatch => episodeWatch.seasonNumber === props.season.seasonNumber,
  )
})

const isSeasonWatched = computed(() => {
  return watchedEpisodes.value.length === props.season.episodeCount && props.season.episodeCount > 0
})

const watchProgress = computed(() => {
  if (!props.season.episodeCount) {
    return 0
  }

  return (watchedEpisodes.value.length / props.season.episodeCount) * 100
})
</script>

<template>
  <div
    ref="seasonRef"
    :class="$style.wrapper"
  >
    <div :class="{ [$style.headerOpen]: open }">
      <UiButton
        variant="text"
        :class="$style.trigger"
        :aria-expanded="open"
        @click="handleToggleOpen"
      >
        <div>
          <div
            :class="[$style.circle, {
              [$style.circleWatched]: isSeasonWatched,
            }]"
            :style="{ '--progress': `${watchProgress}%` }"
          >
            <UiIcon
              v-if="isSeasonWatched"
              name="icon:check"
              :size="14"
            />
          </div>
          <UiTypography variant="label">
            {{ props.season.name }}
          </UiTypography>
        </div>
        <div>
          <UiTypography
            v-if="props.season.episodeCount > 0"
            variant="description"
          >
            {{ watchedEpisodes.length }}/{{ props.season.episodeCount }}
          </UiTypography>
          <UiIcon
            name="icon:arrow"
            :class="[$style.icon, {
              [$style.iconOpen]: open,
            }]"
          />
        </div>
      </UiButton>
      <div
        v-if="open"
        :class="$style.divider"
      >
        <UiDivider />
      </div>
    </div>

    <div
      v-if="open"
      :class="$style.content"
    >
      <slot />
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  border-radius: var(--s-border-radius);
  border: 1px solid var(--c-stroke);
}

.headerOpen {
  position: sticky;
  top: 0;
  z-index: 1;
  margin: -1px -1px 0;
  padding: 1px 1px 0;
  background: var(--c-card-background-hovered);

  &::before {
    content: "";
    position: absolute;
    inset: 0;
    border: 1px solid var(--c-stroke);
    border-bottom: 0;
    border-radius: var(--s-border-radius) var(--s-border-radius) 0 0;
    pointer-events: none;
  }
}

.divider {
  padding: 0 12px 12px 12px;
}

.trigger {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px;
  width: 100%;

  & > div {
    display: flex;
    align-items: center;
    gap: 16px;
  }
}

.circle {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 28px;
  min-width: 28px;
  height: 28px;
  color: var(--c-green);

  &::before,
  &::after {
    content: "";
    position: absolute;
    inset: 0;
    border-radius: 50%;
  }

  &::before {
    background: var(--c-white-10);
    mask: radial-gradient(farthest-side, transparent calc(100% - 1.5px), #000 calc(100% - 1.5px));
  }

  &::after {
    background: conic-gradient(var(--c-label-link) var(--progress, 0%), transparent 0%);
    mask: radial-gradient(farthest-side, transparent calc(100% - 3px), #000 calc(100% - 3px));
  }
}

.circleWatched {
  &::after {
    background: var(--c-green);
  }
}

.icon {
  color: var(--c-text);
  width: 11px;
}

.iconOpen {
  transform: rotate(180deg);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 0 12px 12px;
}
</style>
