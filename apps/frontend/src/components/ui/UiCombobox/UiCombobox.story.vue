<script setup lang="ts">

import UiCombobox from "~/components/ui/UiCombobox/UiCombobox.vue"
import UiComboboxItem from "~/components/ui/UiCombobox/UiComboboxItem.vue"
import { ref } from "vue"

const options = ['Apple', 'Banana', 'Blueberry', 'Grapes', 'Pineapple']
const searchTerm = ref<string>("")
</script>

<template>
  <Story
    title="UiCombobox"
    group="ui-kit"
  >
    <template #default>
      <UiCombobox
        v-model="searchTerm"
        :indent="24"
      >
        <UiComboboxItem
          v-for="(option, index) in options"
          :key="index"
          :value="option"
        >
          {{ option }}
        </UiComboboxItem>
      </UiCombobox>
    </template>

    <template #controls>
      <HstText
        v-model="searchTerm"
        label="Search term"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
