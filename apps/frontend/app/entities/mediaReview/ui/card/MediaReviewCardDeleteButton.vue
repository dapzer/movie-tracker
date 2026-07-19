<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import { useDeleteMediaReviewApi } from "~/api/mediaReviews/useMediaReviewsApi"
import { UiButton } from "~/shared/ui/UiButton"
import { UiConfirmationModal } from "~/shared/ui/UiConfirmationModal"
import { UiIcon } from "~/shared/ui/UiIcon"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"

interface MediaReviewCardDeleteButtonProps {
  mediaReview: MediaReview
}

const props = defineProps<MediaReviewCardDeleteButtonProps>()
const { locale, t } = useI18n()

const deleteMediaReviewApi = useDeleteMediaReviewApi()

const mediaTitle = computed(() => {
  return getCurrentMediaDetails(props.mediaReview.mediaDetails, locale.value)?.title
})

function handleDeleteMediaReviewApi() {
  deleteMediaReviewApi.mutateAsync({ id: props.mediaReview.id }).then(() => {
    toast.success(t("toasts.mediaReview.successDeleted", { title: mediaTitle.value }))
  }).catch(() => {
    toast.error(t("toasts.mediaReview.unsuccessfullyDeleted"))
  })
}
</script>

<template>
  <UiConfirmationModal
    :title="$t('mediaReview.deleteModal.title')"
    :description="$t('mediaReview.deleteModal.description', { title: mediaTitle })"
    @confirm="handleDeleteMediaReviewApi"
  >
    <template #trigger="{ openModal }">
      <UiButton
        :class="$style.button"
        scheme="tertiary"
        variant="textIcon"
        @click="openModal"
      >
        <UiIcon
          name="icon:trash"
          :size="23"
        />
      </UiButton>
    </template>
  </UiConfirmationModal>
</template>

<style module lang="scss">
.button {
  width: 24px;
  height: 24px;
}
</style>
