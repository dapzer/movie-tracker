<script setup lang="ts">
import type { UiMultiSelectFilterConfig, UiMultiSelectFilterValue } from "~/shared/ui/UiFilters"
import { computed, ref, watch } from "vue"
import { UiCheckboxList } from "~/shared/ui/UiCheckboxList"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"

type UiMultiSelectFilterPopoverProps = Pick<UiMultiSelectFilterConfig, "options" | "title">

const props = defineProps<UiMultiSelectFilterPopoverProps>()
const model = defineModel<UiMultiSelectFilterValue>({ default: () => [] })
const openModel = ref(false)
const draftModel = ref<UiMultiSelectFilterValue>([...model.value])

const isActive = computed(() => model.value.length > 0)

function clearModel() {
  draftModel.value = []
  model.value = []
}

watch(openModel, (isOpen) => {
  if (isOpen) {
    draftModel.value = [...model.value]
    return
  }

  model.value = [...draftModel.value]
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
      <UiCheckboxList
        v-model="draftModel"
        :options="props.options"
      />
    </template>
  </UiPopover>
</template>
