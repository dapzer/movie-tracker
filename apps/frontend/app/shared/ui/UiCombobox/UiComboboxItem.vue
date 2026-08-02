<script setup lang="ts">
import { ComboboxItem } from "reka-ui"

interface ComboboxItemProps {
  value: string
}

const props = defineProps<ComboboxItemProps>()
</script>

<template>
  <ComboboxItem
    :value="props.value"
    @select.prevent
  >
    <slot />
  </ComboboxItem>
</template>

<style module lang="scss">
</style>
