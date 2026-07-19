<script setup lang="ts">
import type { MediaReview, MediaReviewWithReason } from "@movie-tracker/types"
import type { UiTagColor } from "~/shared/ui/UiTag"
import { computed, useI18n } from "#imports"
import { MediaReviewModerationLogReason, MediaReviewStatus } from "@movie-tracker/types"
import MediaReviewCardBase from "~/entities/mediaReview/ui/card/MediaReviewCardBase.vue"
import MediaReviewCardDeleteButton from "~/entities/mediaReview/ui/card/MediaReviewCardDeleteButton.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTag } from "~/shared/ui/UiTag"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaReviewCardStatusedProps {
  mediaReview: MediaReviewWithReason
}

interface MediaReviewCardStatusedEmits {
  (e: "onEditClick"): void
}

const props = defineProps<MediaReviewCardStatusedProps>()
const emits = defineEmits<MediaReviewCardStatusedEmits>()
const { t } = useI18n()

const statusTagColorMap: Partial<Record<MediaReview["status"], UiTagColor>> = {
  PENDING: "yellow",
  DRAFT: "tertiary",
  REMOVED: "tertiary",
}

const statusTagTextMap = computed(() => {
  switch (props.mediaReview.status) {
    case "PENDING":
      return t("mediaReview.moderation.reviewStatus.pending")
    case "DRAFT":
      return t("mediaReview.moderation.reviewStatus.draft")
    case "REMOVED":
      return t("mediaReview.moderation.reviewStatus.removed")
    default:
      return ""
  }
})

const reasonText = computed(() => {
  switch (props.mediaReview.reason) {
    case MediaReviewModerationLogReason.OFF_TOPIC:
      return t("mediaReview.moderation.reason.offTopic")
    case MediaReviewModerationLogReason.SPAM:
      return t("mediaReview.moderation.reason.spam")
    case MediaReviewModerationLogReason.TOXICITY:
      return t("mediaReview.moderation.reason.toxicity")
    case MediaReviewModerationLogReason.LOW_EFFORT_JUNK:
      return t("mediaReview.moderation.reason.lowEffortJunk")
    default:
      return t("mediaReview.moderation.reason.other")
  }
})
</script>

<template>
  <MediaReviewCardBase
    :class="{
      [$style.pending]: props.mediaReview.status === 'PENDING',
      [$style.draft]: props.mediaReview.status === 'DRAFT',
      [$style.removed]: props.mediaReview.status === 'REMOVED',
    }"
    :media-review="props.mediaReview"
  >
    <template #footer>
      <div :class="$style.footer">
        <div :class="$style.status">
          <UiTag
            text-variant="label"
            :color="statusTagColorMap[props.mediaReview.status]"
            variant="boxed"
          >
            {{ statusTagTextMap }}
          </UiTag>
          <UiTypography
            v-if="props.mediaReview.reason"
            schema="tertiary"
          >
            {{ $t("mediaReview.moderation.reason.title") }}:{{ " " }}
            {{ reasonText.toLowerCase() }}
          </UiTypography>
        </div>
        <div
          :class="$style.actions"
        >
          <MediaReviewCardDeleteButton
            v-if="[MediaReviewStatus.DRAFT, MediaReviewStatus.PENDING].includes(props.mediaReview.status)"
            :media-review="props.mediaReview"
          />
          <UiButton
            v-if="props.mediaReview.status === MediaReviewStatus.DRAFT"
            variant="textIcon"
            @click="emits('onEditClick')"
          >
            <UiIcon
              :size="19"
              name="icon:edit"
            />
          </UiButton>
        </div>
      </div>
    </template>
  </MediaReviewCardBase>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.pending {
  border-left: 1px solid var(--c-yellow);
}

.draft {
  border-left: 1px solid var(--c-tag-tertiary);
}

.removed {
  border-left: 1px solid var(--c-tag-tertiary);
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;
  row-gap: 12px;

  @include mobileDevice() {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

.status {
  display: flex;
  align-items: center;
  gap: 8px;
  flex-wrap: wrap;
}

.actions {
  display: flex;
  align-items: center;
  gap: 16px;

  & > button {
    width: 24px;
    height: 24px;
  }
}
</style>
