<script setup lang="ts">
import type { UiMultiSelectFilterConfig } from "~/shared/ui/UiFilters/model/types.ts"
import { computed, ref, watch } from "vue"
import { UiCheckboxList } from "~/shared/ui/UiCheckboxList"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"

type UiMultiSelectFilterPopoverProps = Omit<UiMultiSelectFilterConfig, "id" | "type">

const props = defineProps<UiMultiSelectFilterPopoverProps>()
const model = defineModel<string[]>({ default: () => [] })
const openModel = ref(false)
const draftModel = ref<string[]>([...model.value])

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
