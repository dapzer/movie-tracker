<script setup lang="ts">
import type { MediaDetailsInfoSeasonEpisodeType, TvWatchCycleWithEpisodesType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import MediaCardManagementMenuTvProgressEpisodeCheckbox
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressEpisodeCheckbox.vue"
import { UiImage } from "~/shared/ui/UiImage"
import { UiRating } from "~/shared/ui/UiRating"
import { UiTypography } from "~/shared/ui/UiTypography"
import { formatDate } from "~/shared/utils/formatDate.ts"
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
      <UiTypography variant="description">
        {{ formatDate(props.episode.airDate, locale) }}
      </UiTypography>
    </div>
    <div :class="$style.actions">
      <UiRating
        v-if="props.episode.score && isWatched"
        :value="props.episode.score"
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
