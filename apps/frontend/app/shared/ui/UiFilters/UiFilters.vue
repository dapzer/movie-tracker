<script setup lang="ts" generic="TConfig extends UiFilterConfig[]">
import type { UiFilterConfig, UiFiltersModel } from "./model/types.ts"
import { UiDateRangeFilterPopover } from "~/shared/ui/UiDateRangeFilterPopover"
import { UiMultiSelectFilterPopover } from "~/shared/ui/UiMultiSelectFilterPopover"
import { UiRangeFilterPopover } from "~/shared/ui/UiRangeFilterPopover"
import { UiSingleSelectFilterPopover } from "~/shared/ui/UiSingleSelectFilterPopover"

interface UiFiltersProps {
  config: TConfig
}

const props = defineProps<UiFiltersProps>()
const model = defineModel<UiFiltersModel<TConfig>>({ required: true })
</script>

<template>
  <div :class="$style.filters">
    <template
      v-for="filter in props.config"
      :key="filter.id"
    >
      <UiMultiSelectFilterPopover
        v-if="filter.type === 'multiSelect'"
        v-model="model[filter.id] as string[]"
        :title="filter.title"
        :options="filter.options"
      />
      <UiSingleSelectFilterPopover
        v-else-if="filter.type === 'singleSelect'"
        v-model="model[filter.id] as string | number | undefined"
        :title="filter.title"
        :options="filter.options"
        :initial-value="filter.initialValue"
      />
      <UiRangeFilterPopover
        v-else-if="filter.type === 'range'"
        v-model="model[filter.id] as [number, number]"
        :title="filter.title"
        :min="filter.min"
        :max="filter.max"
        :step="filter.step"
        :min-label="filter.minLabel"
        :max-label="filter.maxLabel"
        :get-label="filter.getLabel"
        :initial-value="filter.initialValue"
      />
      <UiDateRangeFilterPopover
        v-else-if="filter.type === 'dateRange'"
        v-model="model[filter.id] as [number | undefined, number | undefined]"
        :title="filter.title"
        :from-label="filter.fromLabel"
        :to-label="filter.toLabel"
        :min-year="filter.minYear"
        :max-year="filter.maxYear"
        :shortcuts="filter.shortcuts"
        :initial-value="filter.initialValue"
      />
    </template>
  </div>
</template>

<style module lang="scss">
.filters {
  display: flex;
  align-items: center;
  flex-wrap: wrap;
  gap: 8px;
}
</style>
