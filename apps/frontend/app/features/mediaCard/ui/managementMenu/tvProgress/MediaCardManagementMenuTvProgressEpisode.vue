<script setup lang="ts">
import type { MediaDetailsInfoSeasonEpisodeType, TvWatchCycleWithEpisodesType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import { useCreateTvEpisodeWatchApi, useDeleteTvEpisodeWatchApi } from "~/api/tvEpisodeWatches/useTvEpisodeWatchesApi.ts"
import { UiCheckbox } from "~/shared/ui/UiCheckbox"
import { UiImage } from "~/shared/ui/UiImage"
import { UiRating } from "~/shared/ui/UiRating"
import { UiTypography } from "~/shared/ui/UiTypography"
import { formatDate } from "~/shared/utils/formatDate.ts"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl.ts"

interface MediaCardManagementMenuTvProgressEpisodeProps {
  episode: MediaDetailsInfoSeasonEpisodeType
  watchCycle: TvWatchCycleWithEpisodesType
}

const props = defineProps<MediaCardManagementMenuTvProgressEpisodeProps>()
const { t, locale } = useI18n()

const createTvEpisodeWatchApi = useCreateTvEpisodeWatchApi()
const deleteTvEpisodeWatchApi = useDeleteTvEpisodeWatchApi()

const episodeWatch = computed(() => {
  return props.watchCycle.episodeWatches.find(
    el => el.seasonNumber === props.episode.seasonNumber && el.episodeNumber === props.episode.episodeNumber,
  )
})

const isWatched = computed(() => Boolean(episodeWatch.value))

const isPending = computed(() => {
  return createTvEpisodeWatchApi.isPending.value || deleteTvEpisodeWatchApi.isPending.value
})

const episodeTitle = computed(() => {
  return `S${props.episode.seasonNumber}.E${props.episode.episodeNumber} ∙ ${props.episode.name}`
})

async function handleToggleWatched() {
  if (episodeWatch.value) {
    await deleteTvEpisodeWatchApi.mutateAsync({
      id: episodeWatch.value.id,
    }).then(() => {
      toast.success(t("toasts.mediaItem.successTvEpisodeWatchChanged"))
    }).catch(() => {
      toast.error(t("toasts.mediaItem.unsuccessfullyTvEpisodeWatchChanged"))
    })
  }
  else {
    await createTvEpisodeWatchApi.mutateAsync({
      watchCycleId: props.watchCycle.id,
      seasonNumber: props.episode.seasonNumber,
      episodeNumber: props.episode.episodeNumber,
    }).then(() => {
      toast.success(t("toasts.mediaItem.successTvEpisodeWatchChanged"))
    }).catch(() => {
      toast.error(t("toasts.mediaItem.unsuccessfullyTvEpisodeWatchChanged"))
    })
  }
}
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
      <UiCheckbox
        :model-value="isWatched"
        :disabled="isPending"
        :aria-label="episodeTitle"
        @update:model-value="handleToggleWatched"
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
