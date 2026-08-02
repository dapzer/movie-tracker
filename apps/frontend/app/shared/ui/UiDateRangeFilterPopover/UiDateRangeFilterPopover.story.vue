<script setup lang="ts">
import type { UiDateRangeFilterOptions, UiDateRangeFilterValue } from "~/shared/ui/UiFilters"
import { ref } from "vue"
import { UiDateRangeFilterPopover } from "~/shared/ui/UiDateRangeFilterPopover"
import { UiTypography } from "~/shared/ui/UiTypography"

const model = ref<UiDateRangeFilterValue>([0, 30])
const options: UiDateRangeFilterOptions = [
  { label: "Last 30 days", value: [0, 30] },
  { label: "Last 90 days", value: [0, 90] },
  { label: "Last year", value: [0, 365] },
]
</script>

<template>
  <Story
    group="ui-kit"
    title="UiDateRangeFilterPopover"
  >
    <Variant title="Default">
      <UiDateRangeFilterPopover
        v-model="model"
        title="Date range"
        :options="options"
      />
      <UiTypography
        as="p"
        variant="description"
      >
        Committed model: {{ model[0] }} – {{ model[1] }} days
      </UiTypography>
    </Variant>
  </Story>
</template>
