<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { computed } from "vue"
import { toast } from "vue3-toastify"
import {
  useCreateMediaReviewDislikeApi,
  useCreateMediaReviewLikeApi,
  useDeleteMediaReviewDislikeApi,
  useDeleteMediaReviewLikeApi,
} from "~/api/mediaReviews/useMediaReviewsApi"
import { UiAvatar } from "~/shared/ui/UiAvatar"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTrimmedText } from "~/shared/ui/UiTrimmedText"
import { UiTypography } from "~/shared/ui/UiTypography"
import { formatDate } from "~/shared/utils/formatDate"

interface MediaReviewCardProps {
  mediaReview: MediaReview
}

const props = defineProps<MediaReviewCardProps>()
const localePath = useLocalePath()
const { locale, t } = useI18n()

const userProfileUrl = computed(() => {
  return localePath(`/profile/${props.mediaReview.user?.id}`)
})

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
    <NuxtLink
      :class="$style.avatarPc"
      :to="userProfileUrl"
    >
      <UiAvatar
        :size="44"
        :src="props.mediaReview.user?.image"
        :placeholder-id="props.mediaReview.user?.id"
        :alt="props.mediaReview.user?.name"
      />
    </NuxtLink>
    <div :class="$style.body">
      <div :class="$style.header">
        <NuxtLink
          :class="$style.user"
          :to="userProfileUrl"
        >
          <UiAvatar
            :class="$style.avatarMobile"
            :size="32"
            :src="props.mediaReview.user?.image"
            :placeholder-id="props.mediaReview.user?.id"
            :alt="props.mediaReview.user?.name"
          />
          <UiTypography variant="cardTitle">
            {{ props.mediaReview.user?.name }}
          </UiTypography>
        </NuxtLink>

        <UiTypography
          v-if="props.mediaReview.publishedAt"
          variant="description"
        >
          {{ formatDate(props.mediaReview.publishedAt, locale) }}
        </UiTypography>
      </div>
      <div :class="$style.content">
        <UiTypography
          v-if="props.mediaReview.title"
          variant="subheading"
        >
          {{ props.mediaReview.title }}
        </UiTypography>
        <UiTrimmedText
          :class="$style.text"
          :text="props.mediaReview.content/*.replace(/\r\s*!/g, '\n\n')*/"
          :max-lines="5"
          :max-chars-in-line="109"
        />
      </div>
      <div :class="$style.footer">
        <div :class="$style.rating">
          <template v-if="props.mediaReview.rating">
            <UiIcon
              :class="$style.star"
              name="icon:rating-star-filled"
              :size="16"
              block
            />
            <UiTypography variant="description">
              {{ props.mediaReview.rating }}/10
            </UiTypography>
          </template>
        </div>

        <div :class="$style.votes">
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
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.wrapper {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: var(--c-review-card-background);
}

.avatarMobile {
  display: none;
}

@include mobileDevice() {
  .avatarPc {
    display: none;
  }

  .avatarMobile {
    display: flex;
  }
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.text {
  white-space: pre-wrap;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.rating {
  display: flex;
  align-items: center;
  gap: 2px;
}

.votes {
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
