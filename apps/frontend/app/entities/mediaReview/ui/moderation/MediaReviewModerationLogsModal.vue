<script setup lang="ts">
import MediaReviewModerationLogsModalContent
  from "~/entities/mediaReview/ui/moderation/MediaReviewModerationLogsModalContent.vue"
import { UiModal } from "~/shared/ui/UiModal"

interface MediaReviewModerationLogsModalProps {
  mediaReviewId: string
}

const props = defineProps<MediaReviewModerationLogsModalProps>()
const slots = defineSlots()
</script>

<template>
  <UiModal
    :max-width="1248"
    :title="$t('mediaReview.moderation.logsModal.title')"
  >
    <template
      v-if="slots.trigger"
      #trigger="{ openModal }"
    >
      <slot
        name="trigger"
        :open-modal="openModal"
      />
    </template>

    <template #content>
      <MediaReviewModerationLogsModalContent :media-review-id="props.mediaReviewId" />
    </template>
  </UiModal>
</template>

<style module lang="scss">
</style>
