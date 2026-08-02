<script setup lang="ts">
import type { UiDateRangeFilterConfig, UiDateRangeFilterValue } from "~/shared/ui/UiFilters/model/types.ts"
import { computed, ref, watch } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import { UiYearRangePicker } from "~/shared/ui/UiYearRangePicker"

type UiDateRangeFilterPopoverProps = Omit<UiDateRangeFilterConfig, "id" | "type">

const props = defineProps<UiDateRangeFilterPopoverProps>()
const model = defineModel<UiDateRangeFilterValue>({ required: true })
const openModel = ref(false)
const draftModel = ref<UiDateRangeFilterValue>([model.value[0], model.value[1]])

const initialValue = computed<UiDateRangeFilterValue>(() => props.initialValue ?? [undefined, undefined])

function isSameRange(left: UiDateRangeFilterValue, right: UiDateRangeFilterValue) {
  return left[0] === right[0] && left[1] === right[1]
}

const isActive = computed(() => {
  return !isSameRange(model.value, initialValue.value)
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
      <UiYearRangePicker
        v-model="draftModel"
        :from-label="props.fromLabel"
        :to-label="props.toLabel"
        :min-year="props.minYear"
        :max-year="props.maxYear"
        :shortcuts="props.shortcuts"
      />
    </template>
  </UiPopover>
</template>
