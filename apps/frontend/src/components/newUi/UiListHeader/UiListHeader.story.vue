<script setup lang="ts">

import UiListHeader from "~/components/newUi/UiListHeader/UiListHeader.vue"
import { UiSelect } from "~/components/newUi/UiSelect"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiListHeader"
  >
    <template #default>
      <UiListHeader
        title="List title"
        subtitle="List subtitle"
      >
        <template #filters>
          <UiSelect
            :width="200"
            :options="[{value: '1', label: 'Option 1'}, {value: '2', label: 'Option 2'}]"
            placeholder="Filter"
          />
        </template>
      </UiListHeader>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
