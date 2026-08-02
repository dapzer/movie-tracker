<script setup lang="ts">
import { ref } from "vue"
import { UiMultiSelectFilterPopover } from "~/shared/ui/UiMultiSelectFilterPopover"
import { UiTypography } from "~/shared/ui/UiTypography"

const model = ref<string[]>(["drama"])
const options = [
  { label: "Action", value: "action" },
  { label: "Drama", value: "drama" },
  { label: "Comedy", value: "comedy" },
]
</script>

<template>
  <Story
    group="ui-kit"
    title="UiMultiSelectFilterPopover"
  >
    <Variant title="Default">
      <UiMultiSelectFilterPopover
        v-model="model"
        title="Genres"
        :options="options"
      />
      <UiTypography
        as="p"
        variant="description"
      >
        Committed model: {{ model.join(", ") || "none" }}
      </UiTypography>
    </Variant>
  </Story>
</template>
