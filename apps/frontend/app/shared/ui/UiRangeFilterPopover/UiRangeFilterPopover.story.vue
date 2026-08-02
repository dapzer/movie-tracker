<script setup lang="ts">
import type { UiRangeFilterValue } from "~/shared/ui/UiFilters"
import { ref } from "vue"
import { UiRangeFilterPopover } from "~/shared/ui/UiRangeFilterPopover"
import { UiTypography } from "~/shared/ui/UiTypography"

const model = ref<UiRangeFilterValue>([2, 8])
</script>

<template>
  <Story
    group="ui-kit"
    title="UiRangeFilterPopover"
  >
    <Variant title="Default">
      <UiRangeFilterPopover
        v-model="model"
        title="Rating"
        :min="0"
        :max="10"
        :step="1"
        min-label="No rating"
        max-label="10"
      />
      <UiTypography
        as="p"
        variant="description"
      >
        Committed model: {{ model[0] }} – {{ model[1] }}
      </UiTypography>
    </Variant>
  </Story>
</template>
