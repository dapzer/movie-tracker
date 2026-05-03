<script setup lang="ts">
import { computed, ref, watch } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import { UiYearRangePicker } from "~/shared/ui/UiYearRangePicker"

const model = defineModel<[number | undefined, number | undefined]>({
  default: () => [undefined, undefined],
})
const openModel = ref(false)
const draftModel = ref<[number | undefined, number | undefined]>(model.value)

const isActive = computed(() => {
  return model.value[0] !== undefined || model.value[1] !== undefined
})

function handleClear() {
  draftModel.value = [undefined, undefined]
  model.value = [undefined, undefined]
}

watch(openModel, (isOpen) => {
  if (isOpen)
    return

  model.value = [draftModel.value[0], draftModel.value[1]]
})
</script>

<template>
  <UiPopover
    v-model="openModel"
    as-child
    :width="325"
    :indent="10"
    :content-spacing="16"
  >
    <template #trigger>
      <UiFilterTrigger
        :active="isActive"
        @clear="handleClear"
      >
        {{ $t('mediaList.filters.releaseYear.title') }}
      </UiFilterTrigger>
    </template>
    <template #content>
      <UiYearRangePicker
        v-model="draftModel"
        :from-label="$t('mediaList.filters.releaseYear.from')"
        :to-label="$t('mediaList.filters.releaseYear.to')"
      />
    </template>
  </UiPopover>
</template>

<style module lang="scss">
</style>
