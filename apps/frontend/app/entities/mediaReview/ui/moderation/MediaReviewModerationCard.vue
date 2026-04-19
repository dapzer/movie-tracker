<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { MediaReviewModerationLogAction } from "@movie-tracker/types"
import { computed } from "vue"
import { useModerateMediaReviewApi } from "~/api/mediaReviewModeration/useMediaReviewModerationApi"
import { MediaReviewCard } from "~/entities/mediaReview"
import MediaReviewModerationModal from "~/entities/mediaReview/ui/moderation/MediaReviewModerationModal.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"

interface MediaReviewModerationCardProps {
  mediaReview: MediaReview
}

const props = defineProps<MediaReviewModerationCardProps>()

const localePath = useLocalePath()
const { locale } = useI18n()

const moderateMediaReviewApi = useModerateMediaReviewApi()

const details = computed(() => {
  return getCurrentMediaDetails(props.mediaReview.mediaDetails, locale.value)
})

const mediaDetailsUrl = computed(() => {
  return localePath(`/details/${props.mediaReview.mediaDetails?.mediaType}/${props.mediaReview.mediaId}`)
})

async function handlePublish(id: string, isSpoiler?: boolean) {
  moderateMediaReviewApi.mutateAsync({
    mediaReviewId: id,
    action: isSpoiler
      ? MediaReviewModerationLogAction.APPROVED_WITH_SPOILER_MARK
      : MediaReviewModerationLogAction.APPROVED,
  })
}
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.info">
      <UiTypography>
        {{ $t(`details.mediaType.${props.mediaReview.mediaDetails?.mediaType}`) }}
      </UiTypography>
      <UiTypography
        :as="NuxtLink"
        :to="mediaDetailsUrl"
        schema="link"
      >
        {{ details?.title }}
        <template v-if="details?.originalTitle && details.title !== details.originalTitle">
          / {{ details.originalTitle }}
        </template>
      </UiTypography>
    </div>
    <MediaReviewCard :media-review="props.mediaReview" />
    <div :class="$style.actions">
      <MediaReviewModerationModal :media-review-id="mediaReview.id">
        <template #trigger="{ openModal }">
          <UiButton
            scheme="tertiary"
            @click="openModal"
          >
            {{ $t("mediaReviews.moderation.review") }}
          </UiButton>
        </template>
      </MediaReviewModerationModal>

      <UiButton
        scheme="secondary"
        @click="handlePublish(props.mediaReview.id, true)"
      >
        {{ $t("mediaReviews.moderation.publishWithSpoiler") }}
      </UiButton>

      <UiButton @click="handlePublish(props.mediaReview.id)">
        {{ $t("mediaReviews.moderation.publish") }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  background: linear-gradient(337.92deg, #151515 3.25%, #1e1e1e 52.25%, #151515 100%);
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 12px;
}

.info {
  display: flex;
  gap: 4px;
}

.actions {
  display: flex;
  gap: 12px;
}
</style>
