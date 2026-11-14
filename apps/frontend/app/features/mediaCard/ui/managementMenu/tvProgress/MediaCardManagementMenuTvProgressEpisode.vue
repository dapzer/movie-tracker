<script setup lang="ts">
import type { MediaDetailsInfoSeasonEpisodeType, TvWatchCycleWithEpisodesType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import MediaCardManagementMenuTvProgressEpisodeCheckbox
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressEpisodeCheckbox.vue"
import MediaCardManagementMenuTvProgressEpisodeRating
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressEpisodeRating.vue"
import { UiDelimiter } from "~/shared/ui/UiDelimiter"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"
import { formatDate } from "~/shared/utils/formatDate.ts"
import { getColorByRating } from "~/shared/utils/getColorByRating"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl.ts"

interface MediaCardManagementMenuTvProgressEpisodeProps {
  episode: MediaDetailsInfoSeasonEpisodeType
  seasonEpisodes: MediaDetailsInfoSeasonEpisodeType[]
  watchCycle: TvWatchCycleWithEpisodesType
}

const props = defineProps<MediaCardManagementMenuTvProgressEpisodeProps>()
const { locale } = useI18n()

const episodeWatch = computed(() => {
  return props.watchCycle.episodeWatches.find(
    el => el.seasonNumber === props.episode.seasonNumber && el.episodeNumber === props.episode.episodeNumber,
  )
})

const isWatched = computed(() => Boolean(episodeWatch.value))
const episodeScore = computed(() => props.episode.score ?? 0)
const scoreColor = computed(() => getColorByRating(episodeScore.value))

const episodeTitle = computed(() => {
  return `S${props.episode.seasonNumber}.E${props.episode.episodeNumber} ∙ ${props.episode.name}`
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.imageWrapper">
      <UiImage
        :class="[$style.image, {
          [$style.imageBlurred]: !isWatched,
        }]"
        :src="getProxiedImageUrl(props.episode.poster, 150)"
        :alt="`${props.episode.name} poster`"
        width="94"
        height="52"
      />
    </div>
    <div :class="$style.content">
      <UiTypography
        :class="$style.title"
        variant="label"
      >
        {{ episodeTitle }}
      </UiTypography>
      <div :class="$style.details">
        <UiTypography variant="description">
          {{ formatDate(props.episode.airDate, locale) }}
        </UiTypography>
        <template v-if="episodeScore && isWatched">
          <UiDelimiter />
          <div
            :class="[$style.score, {
              [$style.gray]: scoreColor === 'gray',
              [$style.red]: scoreColor === 'red',
              [$style.orange]: scoreColor === 'orange',
              [$style.green]: scoreColor === 'green',
            }]"
          >
            <UiIcon name="icon:star" />
            <UiTypography variant="labelSmall">
              {{ Number(episodeScore.toFixed(1)) }}
            </UiTypography>
          </div>
        </template>
      </div>
    </div>
    <div :class="$style.actions">
      <MediaCardManagementMenuTvProgressEpisodeRating
        v-if="episodeWatch"
        :episode-watch="episodeWatch"
        :title="episodeTitle"
      />
      <MediaCardManagementMenuTvProgressEpisodeCheckbox
        :episode="props.episode"
        :season-episodes="props.seasonEpisodes"
        :watch-cycle="props.watchCycle"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@use "~/shared/styles/mixins" as *;

.wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
}

.imageWrapper {
  width: 94px;
  min-width: 94px;
  aspect-ratio: 16 / 9;
  border-radius: var(--s-border-radius-small);
  background: var(--c-white-05);
  overflow: hidden;
}

.details {
  display: flex;
  align-items: center;
  gap: 8px;
}

.score {
  display: flex;
  gap: 2px;
  align-items: center;
  height: fit-content;

  &.green {
    color: var(--c-green-2);
  }

  &.orange {
    color: var(--c-orange-2);
  }

  &.red {
    color: var(--c-red);
  }

  &.gray {
    color: var(--c-description);
  }

  p {
    color: inherit;
  }
}

.image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition:
    filter 0.3s ease,
    transform 0.3s ease;
}

.imageBlurred {
  filter: blur(8px);
  transform: scale(1.15);
}

.content {
  display: flex;
  flex-direction: column;
  gap: 2px;
  flex: 1;
  min-width: 0;

  .title {
    @include ellipsisText;
  }
}

.actions {
  display: flex;
  align-items: center;
  gap: 12px;
}
</style>
