<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { computed, useClipboard, useI18n, useLocalePath } from "#imports"
import { MediaReviewStatus } from "@movie-tracker/types"
import { toast } from "vue3-toastify"
import MediaReviewCardDeleteButton from "~/entities/mediaReview/ui/card/MediaReviewCardDeleteButton.vue"
import { useAuth } from "~/shared/composables/useAuth"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

interface MediaReviewCardActionsProps {
  mediaReview: MediaReview
  hidePageLink?: boolean
}

const props = defineProps<MediaReviewCardActionsProps>()

const { profile } = useAuth()
const { copy, copied } = useClipboard({ copiedDuring: 1000 })
const { t } = useI18n()
const localePath = useLocalePath()

const reviewPagePath = computed(() => {
  return localePath(`/reviews/details/${props.mediaReview.id}`)
})

async function copyLink() {
  await copy(`${window.location.origin}${reviewPagePath.value}`).then(() => {
    toast.success(t("toasts.linkSuccessfullyCopied"))
  }).catch(() => {
    toast.error(t("toasts.linkUnsuccessfullyCopied"))
  })
}

const isDeletable = computed(() => {
  return props.mediaReview.user?.id === profile.value?.id && [MediaReviewStatus.DRAFT, MediaReviewStatus.PUBLISHED, MediaReviewStatus.PENDING].includes(props.mediaReview.status)
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      v-if="!props.hidePageLink"
      :class="$style.button"
      :as="NuxtLink"
      :to="reviewPagePath"
      scheme="link"
      variant="textIcon"
    >
      <UiIcon name="icon:ref" />
    </UiButton>
    <UiButton
      :class="$style.button"
      variant="textIcon"
      :disabled="copied"
      @click="copyLink"
    >
      <UiIcon
        name="icon:share"
        :size="18"
      />
    </UiButton>

    <MediaReviewCardDeleteButton
      v-if="isDeletable"
      :media-review="props.mediaReview"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  gap: 16px;
}

.button {
  width: 24px;
  height: 24px;
}
</style>
