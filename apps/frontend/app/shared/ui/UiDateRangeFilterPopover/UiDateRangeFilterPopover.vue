<script setup lang="ts">
import type { UiDateRangeFilterConfig, UiDateRangeFilterValue } from "~/shared/ui/UiFilters/model/types.ts"
import { computed, ref, watch } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"

type UiDateRangeFilterPopoverProps = Omit<UiDateRangeFilterConfig, "id" | "type">

const props = defineProps<UiDateRangeFilterPopoverProps>()
const model = defineModel<UiDateRangeFilterValue>({ required: true })
const openModel = ref(false)
const draftModel = ref<UiDateRangeFilterValue>([model.value[0], model.value[1]])

const initialValue = computed<UiDateRangeFilterValue>(() => props.initialValue ?? props.options[0].value)

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

function selectOption(value: UiDateRangeFilterValue) {
  draftModel.value = [value[0], value[1]]
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
      <template
        v-for="(option, index) in props.options"
        :key="`${option.value[0]}-${option.value[1]}`"
      >
        <UiButton
          variant="text"
          :class="[$style.option, {
            [$style.optionSelected]: isSameRange(draftModel, option.value),
          }]"
          @click="selectOption(option.value)"
        >
          {{ option.label }}
        </UiButton>
        <UiDivider v-if="index < props.options.length - 1" />
      </template>
    </template>
  </UiPopover>
</template>

<style module lang="scss">
.option {
  padding: 8px 10px;
  width: 100%;
  font-size: var(--fs-label-small);
  justify-content: flex-start;

  &:focus,
  &:active,
  &:hover {
    background: var(--c-white-05);
  }
}

.optionSelected {
  color: var(--c-label-secondary);
}
</style>
