<script setup lang="ts">
import { ref } from "vue"
import { UiRadioCheckboxList } from "~/shared/ui/UiRadioCheckboxList"

const options = [
  {
    label: "Draft",
    value: "draft",
  },
  {
    label: "Pending",
    value: "pending",
  },
  {
    label: "Published",
    value: "published",
  },
]

const value = ref(options[1]?.value)
</script>

<template>
  <Story
    group="ui-kit"
    title="UiRadioCheckboxList"
  >
    <template #default>
      <div :class="$style.wrapper">
        <UiRadioCheckboxList
          v-model="value"
          name="ui-radio-checkbox-list-story"
          :options="options"
        />
      </div>
    </template>

    <template #controls>
      <HstSelect
        v-model="value"
        :options="options"
        title="Value"
      />
    </template>
  </Story>
</template>

<style module lang="scss">
.wrapper {
  width: 265px;
}
</style>
