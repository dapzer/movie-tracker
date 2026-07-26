<script setup lang="ts">
import { useI18n } from "#imports"
import { MediaReviewStatus } from "@movie-tracker/types"
import { computed, ref, watch } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import { UiRadioCheckboxList } from "~/shared/ui/UiRadioCheckboxList"

const status = defineModel<MediaReviewStatus>({ default: MediaReviewStatus.PENDING })

const { t } = useI18n()

const openModel = ref(false)
const draftStatus = ref<MediaReviewStatus>(status.value)

const statusOptions = computed(() => [
  {
    label: t("mediaReview.moderation.reviewStatus.draft"),
    value: MediaReviewStatus.DRAFT,
  },
  {
    label: t("mediaReview.moderation.reviewStatus.pending"),
    value: MediaReviewStatus.PENDING,
  },
  {
    label: t("mediaReview.moderation.reviewStatus.published"),
    value: MediaReviewStatus.PUBLISHED,
  },
  {
    label: t("mediaReview.moderation.reviewStatus.removed"),
    value: MediaReviewStatus.REMOVED,
  },
  {
    label: t("mediaReview.moderation.reviewStatus.deleted"),
    value: MediaReviewStatus.DELETED,
  },
])

const isActive = computed(() => status.value !== MediaReviewStatus.PENDING)

function clearStatus() {
  draftStatus.value = MediaReviewStatus.PENDING
  status.value = MediaReviewStatus.PENDING
}

watch(openModel, (isOpen) => {
  if (isOpen)
    return

  status.value = draftStatus.value
})
</script>

<template>
  <UiPopover
    v-model="openModel"
    as-child
    :width="265"
    :content-spacing="0"
    :indent="10"
  >
    <template #trigger>
      <UiFilterTrigger
        :active="isActive"
        @clear="clearStatus"
      >
        {{ t("mediaReview.moderation.filters.status") }}
      </UiFilterTrigger>
    </template>
    <template #content>
      <UiRadioCheckboxList
        v-model="draftStatus"
        :options="statusOptions"
      />
    </template>
  </UiPopover>
</template>
