<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { computed, useI18n } from "#imports"
import { toast } from "vue3-toastify"
import {
  useCreateMediaReviewDislikeApi,
  useCreateMediaReviewLikeApi,
  useDeleteMediaReviewDislikeApi,
  useDeleteMediaReviewLikeApi,
} from "~/api/mediaReviews/useMediaReviewsApi"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface MediaReviewCardVotesProps {
  mediaReview: MediaReview
}

const props = defineProps<MediaReviewCardVotesProps>()
const { t } = useI18n()

const createLikeApi = useCreateMediaReviewLikeApi()
const deleteLikeApi = useDeleteMediaReviewLikeApi()
const createDislikeApi = useCreateMediaReviewDislikeApi()
const deleteDislikeApi = useDeleteMediaReviewDislikeApi()

function handleLike() {
  if (props.mediaReview.likeId) {
    deleteLikeApi.mutateAsync({ id: props.mediaReview.likeId })
      .then(() => toast.success(t("toasts.mediaReview.successUnliked")))
      .catch(() => toast.error(t("toasts.mediaReview.unsuccessfullyUnliked")))
  }
  else {
    createLikeApi.mutateAsync({
      mediaReviewId: props.mediaReview.id,
      mediaId: props.mediaReview.mediaId,
      mediaType: props.mediaReview.mediaType,
    })
      .then(() => toast.success(t("toasts.mediaReview.successLiked")))
      .catch(() => toast.error(t("toasts.mediaReview.unsuccessfullyLiked")))
  }
}
function handleDislike() {
  if (props.mediaReview.dislikeId) {
    deleteDislikeApi.mutateAsync({ id: props.mediaReview.dislikeId })
      .then(() => toast.success(t("toasts.mediaReview.successUndisliked")))
      .catch(() => toast.error(t("toasts.mediaReview.unsuccessfullyUndisliked")))
  }
  else {
    createDislikeApi.mutateAsync({
      mediaReviewId: props.mediaReview.id,
      mediaId: props.mediaReview.mediaId,
      mediaType: props.mediaReview.mediaType,
    })
      .then(() => toast.success(t("toasts.mediaReview.successDisliked")))
      .catch(() => toast.error(t("toasts.mediaReview.unsuccessfullyDisliked")))
  }
}

const isOpinionButtonsDisabled = computed(() => {
  return createLikeApi.isPending.value || deleteLikeApi.isPending.value || createDislikeApi.isPending.value || deleteDislikeApi.isPending.value
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      variant="text"
      :disabled="isOpinionButtonsDisabled"
      @click="handleLike"
    >
      {{ props.mediaReview.likesCount }}
      <UiIcon
        :name="props.mediaReview.likeId ? 'icon:thumb-up' : 'icon:thumb-up-outlined'"
        :size="16"
        block
      />
    </UiButton>
    <UiButton
      variant="text"
      :disabled="isOpinionButtonsDisabled"
      @click="handleDislike"
    >
      {{ props.mediaReview.dislikesCount }}
      <UiIcon
        :name="props.mediaReview.dislikeId ? 'icon:thumb-down' : 'icon:thumb-down-outlined'"
        :size="16"
        block
      />
    </UiButton>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  gap: 16px;

  button {
    display: flex;
    align-items: center;
    gap: 4px;
    color: var(--c-description);

    &:hover,
    &:focus,
    &:active {
      color: var(--c-text);
    }
  }
}
</style>
