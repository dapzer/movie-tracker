<script setup lang="ts">
import type { MediaReviewModerationLog } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { UiModal } from "~/shared/ui/UiModal"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaReviewModerationLogSnapshotModalProps {
  log: MediaReviewModerationLog
}

const props = defineProps<MediaReviewModerationLogSnapshotModalProps>()
const slots = defineSlots()

const { t } = useI18n()

const rows = computed(() => {
  return [
    {
      label: "mediaReview.moderation.logsModal.snapshotModal.reviewTitle",
      value: props.log.reviewTitleSnapshot || t("mediaReview.moderation.logsModal.snapshotModal.noTitle"),
    },
    {
      label: "mediaReview.moderation.logsModal.snapshotModal.reviewIsSpoiler",
      value: props.log.reviewIsSpoilerSnapshot ? t("ui.yes") : t("ui.no"),
    },
    {
      label: "mediaReview.moderation.logsModal.snapshotModal.reviewContent",
      value: props.log.reviewContentSnapshot,
    },
  ]
})
</script>

<template>
  <UiModal
    :max-width="720"
    :title="$t('mediaReview.moderation.logsModal.snapshotModal.title')"
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
      <div :class="$style.wrapper">
        <div
          v-for="row in rows"
          :key="row.label"
          :class="$style.section"
        >
          <UiTypography
            variant="label"
            :class="$style.label"
          >
            {{ $t(row.label) }}
          </UiTypography>
          <UiTypography :class="$style.value">
            {{ row.value }}
          </UiTypography>
        </div>
      </div>
    </template>
  </UiModal>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.label {
  color: var(--c-text);
}

.value {
  color: var(--c-text-secondary);
  white-space: pre-wrap;
  overflow-wrap: anywhere;
}
</style>
