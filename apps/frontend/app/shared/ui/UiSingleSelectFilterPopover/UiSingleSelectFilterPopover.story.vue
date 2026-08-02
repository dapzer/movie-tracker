<script setup lang="ts">
import type { UiFilterOptionValue } from "~/shared/ui/UiFilters"
import { ref } from "vue"
import { UiSingleSelectFilterPopover } from "~/shared/ui/UiSingleSelectFilterPopover"
import { UiTypography } from "~/shared/ui/UiTypography"

const model = ref<UiFilterOptionValue | undefined>("pending")
const options = [
  { label: "Draft", value: "draft" },
  { label: "Pending", value: "pending" },
  { label: "Published", value: "published" },
]
</script>

<template>
  <Story
    group="ui-kit"
    title="UiSingleSelectFilterPopover"
  >
    <Variant title="Default">
      <UiSingleSelectFilterPopover
        v-model="model"
        title="Status"
        :options="options"
        initial-value="draft"
      />
      <UiTypography
        as="p"
        variant="description"
      >
        Committed model: {{ model ?? "all" }}
      </UiTypography>
    </Variant>
  </Story>
</template>
