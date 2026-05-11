<script setup lang="ts">
import type { MediaListDetailsFilters } from "~/widgets/mediaList/ui/filters/MediaListDetailsFilters.vue"
import { useI18n } from "#imports"
import { computed, ref, watch } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import CheckboxList from "~/widgets/mediaList/ui/filters/CheckboxList.vue"

const { t } = useI18n()

const releaseStatuses = defineModel<MediaListDetailsFilters["releaseStatuses"]>({ default: () => [] })
const openModel = ref(false)
const draftReleaseStatuses = ref<MediaListDetailsFilters["releaseStatuses"]>(releaseStatuses.value)

const releaseStatusOptions = computed(() => {
  return [
    "rumored",
    "canceled",
    "planned",
    "pilot",
    "in production",
    "returning series",
    "post production",
    "released",
    "ended",
  ].map(el => ({
    label: t(`details.allStatusNames.${el}`),
    value: el,
  }))
})

const isActive = computed(() => releaseStatuses.value.length > 0)

function clearReleaseStatuses() {
  draftReleaseStatuses.value = []
  releaseStatuses.value = []
}

watch(openModel, (isOpen) => {
  if (isOpen)
    return

  releaseStatuses.value = [...draftReleaseStatuses.value]
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
        @clear="clearReleaseStatuses"
      >
        {{ t("mediaList.filters.releaseStatus") }}
      </UiFilterTrigger>
    </template>
    <template #content>
      <CheckboxList
        v-model="draftReleaseStatuses"
        :options="releaseStatusOptions"
      />
    </template>
  </UiPopover>
</template>

<style module lang="scss">
.popoverContent {
  display: flex;
  flex-direction: column;
}

.checkboxOption {
  display: flex;
  align-items: center;
  gap: 8px;
  cursor: pointer;
}
</style>
