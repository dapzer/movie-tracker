<script setup lang="ts">
import { computed } from "vue"
import { UiFilterTrigger } from "~/shared/ui/UiFilterTrigger"
import { UiPopover } from "~/shared/ui/UiPopover"
import { UiYearRangePicker } from "~/shared/ui/UiYearRangePicker"

const model = defineModel<[number | undefined, number | undefined]>({
  default: () => [undefined, undefined],
})

const isActive = computed(() => {
  return model.value[0] !== undefined || model.value[1] !== undefined
})

function handleClear() {
  model.value = [undefined, undefined]
}
</script>

<template>
  <UiPopover
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
        v-model="model"
        :from-label="$t('mediaList.filters.releaseYear.from')"
        :to-label="$t('mediaList.filters.releaseYear.to')"
      />
    </template>
  </UiPopover>
</template>

<style module lang="scss">
</style>
