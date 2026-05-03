<script setup lang="ts">
import type { MediaTypeEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaTypeEnum as MediaType } from "@movie-tracker/types"
import { computed, ref, watch } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import CheckboxList from "~/widgets/mediaList/ui/filters/CheckboxList.vue"

const { t } = useI18n()

const mediaTypes = defineModel<MediaTypeEnum[]>({ default: () => [] })
const openModel = ref(false)
const draftMediaTypes = ref<MediaTypeEnum[]>(mediaTypes.value)

const mediaTypeOptions = computed(() => {
  return [
    {
      label: t("details.mediaType.movie"),
      value: MediaType.MOVIE,
    },
    {
      label: t("details.mediaType.tv"),
      value: MediaType.TV,
    },
  ]
})

const isActive = computed(() => mediaTypes.value.length > 0)

function clearMediaTypes() {
  draftMediaTypes.value = []
  mediaTypes.value = []
}

watch(openModel, (isOpen) => {
  if (isOpen)
    return

  mediaTypes.value = [...draftMediaTypes.value]
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
        @clear="clearMediaTypes"
      >
        {{ t("mediaList.filters.mediaType") }}
      </UiFilterTrigger>
    </template>
    <template #content>
      <CheckboxList
        v-model="draftMediaTypes"
        :options="mediaTypeOptions"
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
