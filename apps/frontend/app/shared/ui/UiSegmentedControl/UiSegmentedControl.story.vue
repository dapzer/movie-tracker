<script setup lang="ts">
import { ref } from "vue"
import { UiSegmentedControl } from "~/shared/ui/UiSegmentedControl/index"

const disabled = ref(false)
const value = ref("new")

const options = [
  { label: "New list", value: "new" },
  { label: "Existing list", value: "existing" },
]
</script>

<template>
  <Story
    group="ui-kit"
    title="UiSegmentedControl"
  >
    <template #default>
      <UiSegmentedControl
        v-model="value"
        :options="options"
        :disabled="disabled"
      />
    </template>

    <template #controls>
      <HstText
        v-model="value"
        title="Value"
      />
      <HstCheckbox
        v-model="disabled"
        title="Disabled"
      />
    </template>
  </Story>
</template>
