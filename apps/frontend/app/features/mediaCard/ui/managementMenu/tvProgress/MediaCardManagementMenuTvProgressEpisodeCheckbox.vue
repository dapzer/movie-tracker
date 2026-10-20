<script setup lang="ts">
import type { MediaDetailsInfoSeasonEpisodeType, TvWatchCycleWithEpisodesType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { toast } from "vue3-toastify"
import {
  useBulkCreateTvEpisodeWatchApi,
  useCreateTvEpisodeWatchApi,
  useDeleteTvEpisodeWatchApi,
} from "~/api/tvEpisodeWatches/useTvEpisodeWatchesApi.ts"
import { UiButton } from "~/shared/ui/UiButton"
import { UiCheckbox } from "~/shared/ui/UiCheckbox"
import { UiPopover } from "~/shared/ui/UiPopover"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaCardManagementMenuTvProgressEpisodeCheckboxProps {
  episode: MediaDetailsInfoSeasonEpisodeType
  seasonEpisodes: MediaDetailsInfoSeasonEpisodeType[]
  watchCycle: TvWatchCycleWithEpisodesType
}

const props = defineProps<MediaCardManagementMenuTvProgressEpisodeCheckboxProps>()
const { t } = useI18n()

const createTvEpisodeWatchApi = useCreateTvEpisodeWatchApi()
const deleteTvEpisodeWatchApi = useDeleteTvEpisodeWatchApi()
const bulkCreateTvEpisodeWatchApi = useBulkCreateTvEpisodeWatchApi()

const isMarkWatchedPopoverOpen = ref(false)

const episodeWatch = computed(() => {
  return props.watchCycle.episodeWatches.find(
    el => el.seasonNumber === props.episode.seasonNumber && el.episodeNumber === props.episode.episodeNumber,
  )
})

const isWatched = computed(() => Boolean(episodeWatch.value))

const isPending = computed(() => {
  return createTvEpisodeWatchApi.isPending.value
    || deleteTvEpisodeWatchApi.isPending.value
    || bulkCreateTvEpisodeWatchApi.isPending.value
})

const episodeTitle = computed(() => {
  return `S${props.episode.seasonNumber}.E${props.episode.episodeNumber} ∙ ${props.episode.name}`
})

const previousUnwatchedEpisodes = computed(() => {
  const isEpisodeWatched = (episodeNumber: number) => {
    return props.watchCycle.episodeWatches.some(
      watch => watch.seasonNumber === props.episode.seasonNumber && watch.episodeNumber === episodeNumber,
    )
  }

  const previousEpisodes = props.seasonEpisodes
    .filter(episode => episode.episodeNumber < props.episode.episodeNumber)
    .sort((a, b) => b.episodeNumber - a.episodeNumber)

  const result: MediaDetailsInfoSeasonEpisodeType[] = []

  for (const episode of previousEpisodes) {
    if (isEpisodeWatched(episode.episodeNumber)) {
      break
    }

    result.unshift(episode)
  }

  return result
})

const hasUnwatchedPreviousEpisodes = computed(() => {
  return previousUnwatchedEpisodes.value.length > 0
})

async function createCurrentEpisodeWatch() {
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
  else if (!hasUnwatchedPreviousEpisodes.value) {
    await createCurrentEpisodeWatch()
  }
}

async function handleMarkAllWatched() {
  const episodesToMark = [...previousUnwatchedEpisodes.value, props.episode]

  await bulkCreateTvEpisodeWatchApi.mutateAsync({
    watchCycleId: props.watchCycle.id,
    episodes: episodesToMark.map(episode => ({
      seasonNumber: episode.seasonNumber,
      episodeNumber: episode.episodeNumber,
    })),
  }).then(() => {
    isMarkWatchedPopoverOpen.value = false
    toast.success(t("toasts.mediaItem.successTvEpisodeWatchChanged"))
  }).catch(() => {
    toast.error(t("toasts.mediaItem.unsuccessfullyTvEpisodeWatchChanged"))
  })
}

async function handleMarkOnlyCurrentWatched() {
  await createCurrentEpisodeWatch()
  isMarkWatchedPopoverOpen.value = false
}
</script>

<template>
  <UiPopover
    v-if="!isWatched && hasUnwatchedPreviousEpisodes"
    v-model="isMarkWatchedPopoverOpen"
    as-child
    with-arrow
    side="left"
    :content-class="$style.popoverContent"
    :indent="10"
    :width="320"
    :content-spacing="16"
  >
    <template #trigger>
      <UiCheckbox
        :model-value="isWatched"
        :disabled="isPending"
        :aria-label="episodeTitle"
        @click.prevent
      />
    </template>
    <template #content>
      <div :class="$style.content">
        <UiTypography
          :class="$style.title"
          variant="description"
        >
          {{ t("mediaItem.managementMenu.tvProgress.markPreviousWatchedTitle", { count: previousUnwatchedEpisodes.length }) }}
        </UiTypography>
        <div :class="$style.actions">
          <UiButton
            :disabled="isPending"
            @click="handleMarkAllWatched"
          >
            {{ t("mediaItem.managementMenu.tvProgress.markAllWatched") }}
          </UiButton>
          <UiButton
            variant="outlined"
            :disabled="isPending"
            @click="handleMarkOnlyCurrentWatched"
          >
            {{ t("mediaItem.managementMenu.tvProgress.markOnlyCurrentWatched") }}
          </UiButton>
        </div>
      </div>
    </template>
  </UiPopover>
  <UiCheckbox
    v-else
    :model-value="isWatched"
    :disabled="isPending"
    :aria-label="episodeTitle"
    @update:model-value="handleToggleWatched"
  />
</template>

<style module lang="scss">
.popoverContent {
  --ui-popover-background: var(--c-main-background);
  & > div {
    border: none;
  }
}
.content {
  display: flex;
  flex-direction: column;
  gap: 12px;
}

.title {
  color: var(--c-text);
}

.actions {
  display: flex;
  flex-direction: column;
  gap: 6px;

  button {
    width: 100%;
  }
}
</style>
