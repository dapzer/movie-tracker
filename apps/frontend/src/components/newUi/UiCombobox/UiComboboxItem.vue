<script setup lang="ts">
import { ComboboxItem } from "radix-vue"

interface ComboboxItemProps {
  value: string
}

const props = defineProps<ComboboxItemProps>()
</script>

<template>
  <ComboboxItem
    :class="$style.item"
    :value="props.value"
    @select.prevent
  >
    <slot />
  </ComboboxItem>
</template>

<style module lang="scss">
.item {

}
</style>
