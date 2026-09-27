<script setup lang="ts">
import { ref } from "vue"
import { UiStatCard } from "~/shared/ui/UiStatCard/index"

const label = ref("Watched")
const value = ref("183")
</script>

<template>
  <Story
    group="ui-kit"
    title="UiStatCard"
    :layout="{
      type: 'grid',
      width: 220,
    }"
  >
    <Variant title="Default">
      <UiStatCard
        :label="label"
        :value="value"
      />
    </Variant>

    <Variant title="Danger">
      <UiStatCard
        :label="label"
        :value="value"
        variant="danger"
      />
    </Variant>

    <template #controls>
      <HstText
        v-model="label"
        title="Label"
      />
      <HstText
        v-model="value"
        title="Value"
      />
    </template>
  </Story>
</template>
