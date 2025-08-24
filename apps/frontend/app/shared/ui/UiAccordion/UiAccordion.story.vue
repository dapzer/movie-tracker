<script setup lang="ts">
import { ref } from "vue"
import UiAccordion from "~/shared/ui/UiAccordion/UiAccordion.vue"

const value = ref<string | string[]>(["item-1"])
</script>

<template>
  <Story
    title="UiAccordion"
    group="ui-kit"
  >
    <template #default>
      <UiAccordion
        v-model="value"
        :items="[
          { title: 'Title 1', content: 'Content 1', value: 'item-1' },
          { title: 'Title 2', content: 'Content 2', value: 'item-2' },
          { title: 'Title 3', content: 'Content 3', value: 'item-3' },
        ]"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
