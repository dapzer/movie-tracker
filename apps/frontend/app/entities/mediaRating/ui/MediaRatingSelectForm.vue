<script setup lang="ts">
import type { MediaRatingType, MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { ref } from "vue"
import { toast } from "vue3-toastify"
import {
  useCreateMediaRatingApi,
  useDeleteMediaRatingApi,
  useUpdateMediaRatingApi,
} from "~/api/mediaRatings/useMediaRatingsApi"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiStarsList } from "~/shared/ui/UiStarsList"
import { UiTypography } from "~/shared/ui/UiTypography"

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

const selectedRating = ref<number | undefined>(undefined)
const hoveredRating = ref<number | undefined>(undefined)

async function handleSubmit() {
  if (!selectedRating.value) {
    return
  }

  if (props.currentRating?.id) {
    await updateMediaRatingApi.mutateAsync({
      id: props.currentRating.id,
      body: {
        rating: selectedRating.value,
      },
    }).then(() => {
      toast.success(t("toasts.mediaRating.successUpdated"))
    }).catch(() => {
      toast.error(t("toasts.mediaRating.unsuccessfullyUpdated"))
    })
  }
  else {
    await createMediaRatingApi.mutateAsync({
      rating: selectedRating.value,
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
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <UiTypography variant="description">
        {{ $t("mediaRating.howRate") }}
      </UiTypography>
      <UiTypography variant="title4">
        {{ props.title }}
      </UiTypography>
    </div>

    <div :class="$style.content">
      <div
        :class="[$style.result, {
          [$style.active]: selectedRating,
        }]"
      >
        <UiTypography
          variant="title4"
          :class="$style.rating"
        >
          {{ hoveredRating || (selectedRating ? selectedRating : "?") }}
        </UiTypography>
      </div>
      <UiStarsList
        v-model="selectedRating"
        v-model:hovered-rating="hoveredRating"
      />
    </div>
    <div :class="$style.actions">
      <UiButton
        v-if="props.currentRating"
        size="large"
        scheme="tertiary"
        :class="$style.submitButton"
        :disabled="createMediaRatingApi.isPending.value || updateMediaRatingApi.isPending.value
          || deleteMediaRatingApi.isPending.value"
        with-icon
        @click="handleDelete"
      >
        <UiIcon
          name="icon:trash"
          :size="19"
        />
        {{ $t("mediaRating.deleteRate") }}
      </UiButton>
      <UiButton
        size="large"
        :class="$style.submitButton"
        :disabled="createMediaRatingApi.isPending.value || updateMediaRatingApi.isPending.value
          || deleteMediaRatingApi.isPending.value
          || !selectedRating"
        @click="handleSubmit"
      >
        {{ props.currentRating ? $t("mediaRating.updateRate") : $t("mediaRating.rate") }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 24px;
}

.header {
  display: flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  gap: 4px;
}

.content {
  background-color: var(--c-header-footer-background);
  border-radius: 8px;
  padding: 20px 0;
  display: flex;
  justify-content: center;
  flex-direction: column;
  align-items: center;
  position: relative;
}

.result {
  position: absolute;
  top: -14px;
  margin: 0 auto;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 34px;
  width: 64px;
  height: 28px;
  background: var(--c-description);

  p {
    font-family: var(--ff-inter);
  }

  &.active {
    background: var(--c-gold);

    p {
      color: var(--c-card-background-hovered);
    }
  }
}

.submitButton {
  width: 100%;
}

.actions {
  display: flex;
  justify-content: center;
  gap: 12px;
}
</style>
