<script setup lang="ts">
import type { UiDateRangeFilterValue } from "~/shared/ui/UiFilters"
import { ref } from "vue"
import { UiDateRangeFilterPopover } from "~/shared/ui/UiDateRangeFilterPopover"
import { UiTypography } from "~/shared/ui/UiTypography"

const model = ref<UiDateRangeFilterValue>([2000, 2010])
const shortcuts = [2020, 2010, 2000, 1990]
</script>

<template>
  <Story
    group="ui-kit"
    title="UiDateRangeFilterPopover"
  >
    <Variant title="Default">
      <UiDateRangeFilterPopover
        v-model="model"
        title="Release year"
        from-label="From"
        to-label="To"
        :min-year="1900"
        :max-year="2030"
        :shortcuts="shortcuts"
      />
      <UiTypography
        as="p"
        variant="description"
      >
        Committed model: {{ model[0] ?? "not set" }} – {{ model[1] ?? "not set" }}
      </UiTypography>
    </Variant>
  </Story>
</template>
