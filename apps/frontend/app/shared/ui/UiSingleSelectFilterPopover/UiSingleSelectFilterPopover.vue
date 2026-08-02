<script setup lang="ts">
import type { UiFilterOptionValue, UiSingleSelectFilterConfig } from "~/shared/ui/UiFilters/model/types.ts"
import { computed, ref, watch } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import { UiRadioCheckboxList } from "~/shared/ui/UiRadioCheckboxList"

type UiSingleSelectFilterPopoverProps = Omit<UiSingleSelectFilterConfig, "id" | "type">

const props = defineProps<UiSingleSelectFilterPopoverProps>()
const model = defineModel<UiFilterOptionValue | undefined>({ required: true })
const openModel = ref(false)
const draftModel = ref<UiFilterOptionValue | undefined>(model.value)

const isActive = computed(() => model.value !== props.initialValue)

function clearModel() {
  draftModel.value = props.initialValue
  model.value = props.initialValue
}

watch(openModel, (isOpen) => {
  if (isOpen) {
    draftModel.value = model.value
    return
  }

  model.value = draftModel.value
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
        @clear="clearModel"
      >
        {{ props.title }}
      </UiFilterTrigger>
    </template>
    <template #content>
      <UiRadioCheckboxList
        v-model="draftModel"
        :options="props.options"
      />
    </template>
  </UiPopover>
</template>
