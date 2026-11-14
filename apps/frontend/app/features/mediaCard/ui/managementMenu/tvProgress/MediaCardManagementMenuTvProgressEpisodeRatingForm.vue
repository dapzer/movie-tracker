<script setup lang="ts">
import type { TvEpisodeWatchType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import { useUpdateTvEpisodeWatchRatingApi } from "~/api/tvEpisodeWatches/useTvEpisodeWatchesApi"
import { UiRateForm } from "~/shared/ui/UiRateForm"

interface MediaCardManagementMenuTvProgressEpisodeRatingFormProps {
  episodeWatch: TvEpisodeWatchType
  title: string
}

interface MediaCardManagementMenuTvProgressEpisodeRatingFormEmits {
  (event: "afterSubmit"): void
}

const props = defineProps<MediaCardManagementMenuTvProgressEpisodeRatingFormProps>()
const emits = defineEmits<MediaCardManagementMenuTvProgressEpisodeRatingFormEmits>()

const { t } = useI18n()
const updateTvEpisodeWatchRatingApi = useUpdateTvEpisodeWatchRatingApi()
const hasRating = computed(() => props.episodeWatch.rating !== null)
const isPending = computed(() => updateTvEpisodeWatchRatingApi.isPending.value)

async function handleSubmit(rating: number) {
  try {
    await updateTvEpisodeWatchRatingApi.mutateAsync({
      id: props.episodeWatch.id,
      body: {
        rating,
      },
    })
    toast.success(t(hasRating.value ? "toasts.mediaRating.successUpdated" : "toasts.mediaRating.successRated"))
    emits("afterSubmit")
  }
  catch {
    toast.error(t(hasRating.value ? "toasts.mediaRating.unsuccessfullyUpdated" : "toasts.mediaRating.unsuccessfullyRated"))
  }
}

async function handleDelete() {
  if (!hasRating.value) {
    return
  }

  try {
    await updateTvEpisodeWatchRatingApi.mutateAsync({
      id: props.episodeWatch.id,
      body: {
        rating: null,
      },
    })
    toast.success(t("toasts.mediaRating.successDeleted"))
    emits("afterSubmit")
  }
  catch {
    toast.error(t("toasts.mediaRating.unsuccessfullyDeleted"))
  }
}
</script>

<template>
  <UiRateForm
    :title="props.title"
    :current-rating="props.episodeWatch.rating"
    :is-pending="isPending"
    @submit="handleSubmit"
    @delete="handleDelete"
  />
</template>
