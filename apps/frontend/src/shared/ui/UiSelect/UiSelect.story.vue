<script setup lang="ts">

import UiSelect, { type OptionType } from "~/shared/ui/UiSelect/UiSelect.vue"
import { ref } from "vue"

const options = [
  {
    label: "Option 1",
    value: "1"
  },
  {
    label: "Option 2",
    value: "2"
  },
  {
    label: "Option 3",
    value: "3"
  },
  {
    label: "Option 4",
    value: "4"
  },
  {
    label: "Option 5",
    value: "5"
  },
  {
    label: "Option 6",
    value: "6"
  },
  {
    label: "Option 7",
    value: "7"
  },
  {
    label: "Option 8",
    value: "8"
  },
  {
    label: "Option 9",
    value: "9"
  },
  {
    label: "Option 10",
    value: "10"
  },
  {
    label: "Option 11",
    value: "11"
  },
  {
    label: "Option 12",
    value: "12"
  },
  {
    label: "Option 13",
    value: "13"
  },
  {
    label: "Option 14",
    value: "14"
  },
  {
    label: "Option 15",
    value: "15"
  },
  {
    label: "Option 16",
    value: "16"
  },
] satisfies OptionType[]
const value = ref(options[0].value)
const disabled = ref(false)
</script>

<template>
  <Story
    group="ui-kit"
    title="UiSelect"
  >
    <template #default>
      <UiSelect
        v-model="value"
        :options="options"
        :disabled="disabled"
      />
    </template>

    <template #controls>
      <HstCheckbox
        v-model="disabled"
        title="Disabled"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
