<script setup lang="ts">
import type { UiRangeFilterConfig, UiRangeFilterValue } from "~/shared/ui/UiFilters/model/types"
import { computed, ref, watch } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import { UiRangeSlider } from "~/shared/ui/UiRangeSlider"

type UiRangeFilterPopoverProps = Omit<UiRangeFilterConfig, "id" | "type">

const props = defineProps<UiRangeFilterPopoverProps>()
const model = defineModel<UiRangeFilterValue>({ required: true })
const openModel = ref(false)
const draftModel = ref<UiRangeFilterValue>([model.value[0], model.value[1]])

const initialValue = computed<UiRangeFilterValue>(() => props.initialValue ?? [props.min, props.max])

const isActive = computed(() => {
  return model.value[0] !== initialValue.value[0] || model.value[1] !== initialValue.value[1]
})

function clearModel() {
  draftModel.value = [initialValue.value[0], initialValue.value[1]]
  model.value = [initialValue.value[0], initialValue.value[1]]
}

watch(openModel, (isOpen) => {
  if (isOpen) {
    draftModel.value = [model.value[0], model.value[1]]
    return
  }

  model.value = [draftModel.value[0], draftModel.value[1]]
})
</script>

<template>
  <UiPopover
    v-model="openModel"
    as-child
    :width="325"
    :content-spacing="16"
    :indent="10"
  >
    <template #trigger>
      <UiFilterTrigger
        :active="isActive"
        @clear="clearModel"
      >
        {{ props.title }}
      </UiFilterTrigger>
    </template>
    <template #content>
      <UiRangeSlider
        v-model="draftModel"
        :min="props.min"
        :max="props.max"
        :step="props.step"
        :min-label="props.minLabel"
        :max-label="props.maxLabel"
        :get-label="props.getLabel"
      />
    </template>
  </UiPopover>
</template>
