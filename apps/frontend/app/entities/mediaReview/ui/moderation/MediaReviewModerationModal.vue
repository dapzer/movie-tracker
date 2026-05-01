<script setup lang="ts">
import { ref } from "vue"
import { UiModal } from "~/shared/ui/UiModal"
import MediaReviewModerationForm from "./MediaReviewModerationForm.vue"

interface MediaReviewModerationModalProps {
  mediaReviewId: string
}

const props = defineProps<MediaReviewModerationModalProps>()

const slots = defineSlots()
const modalVisible = ref<boolean>()
</script>

<template>
  <UiModal
    v-model="modalVisible"
    :max-width="495"
    :title="$t('mediaReviews.moderation.modal.title')"
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
      <MediaReviewModerationForm
        :media-review-id="props.mediaReviewId"
        @on-cancel="modalVisible = false"
        @on-success="modalVisible = false"
      />
    </template>
  </UiModal>
</template>
