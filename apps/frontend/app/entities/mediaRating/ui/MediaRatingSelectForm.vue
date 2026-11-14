<script setup lang="ts">
import type { MediaRatingType, MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import {
  useCreateMediaRatingApi,
  useDeleteMediaRatingApi,
  useUpdateMediaRatingApi,
} from "~/api/mediaRatings/useMediaRatingsApi"
import { UiRateForm } from "~/shared/ui/UiRateForm"

interface MediaRatingSelectFormProps {
  currentRating?: MediaRatingType
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  title: string
}

interface MediaRatingSelectFormEmits {
  (event: "afterSubmit"): void
}

const props = defineProps<MediaRatingSelectFormProps>()
const emits = defineEmits<MediaRatingSelectFormEmits>()

const { t } = useI18n()
const createMediaRatingApi = useCreateMediaRatingApi()
const updateMediaRatingApi = useUpdateMediaRatingApi()
const deleteMediaRatingApi = useDeleteMediaRatingApi()
const isPending = computed(() => {
  return createMediaRatingApi.isPending.value
    || updateMediaRatingApi.isPending.value
    || deleteMediaRatingApi.isPending.value
})

async function handleSubmit(rating: number) {
  if (props.currentRating?.id) {
    await updateMediaRatingApi.mutateAsync({
      id: props.currentRating.id,
      body: {
        rating,
      },
    }).then(() => {
      toast.success(t("toasts.mediaRating.successUpdated"))
    }).catch(() => {
      toast.error(t("toasts.mediaRating.unsuccessfullyUpdated"))
    })
  }
  else {
    await createMediaRatingApi.mutateAsync({
      rating,
      mediaId: props.mediaId,
      mediaType: props.mediaType as unknown as MediaTypeEnum,
    }).then(() => {
      toast.success(t("toasts.mediaRating.successRated"))
    }).catch(() => {
      toast.error(t("toasts.mediaRating.unsuccessfullyRated"))
    })
  }

  emits("afterSubmit")
}

async function handleDelete() {
  if (!props.currentRating?.id) {
    return
  }

  await deleteMediaRatingApi.mutateAsync({
    id: props.currentRating.id,
  }).then(() => {
    toast.success(t("toasts.mediaRating.successDeleted"))
  }).catch(() => {
    toast.error(t("toasts.mediaRating.unsuccessfullyDeleted"))
  })

  emits("afterSubmit")
}
</script>

<template>
  <UiRateForm
    :title="props.title"
    :current-rating="props.currentRating?.rating"
    :is-pending="isPending"
    @submit="handleSubmit"
    @delete="handleDelete"
  />
</template>
