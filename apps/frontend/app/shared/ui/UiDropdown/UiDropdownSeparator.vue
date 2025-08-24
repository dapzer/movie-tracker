<script setup lang="ts">
import { DropdownMenuSeparator } from "radix-vue"
</script>

<template>
  <DropdownMenuSeparator :class="$style.body" />
</template>

<style module lang="scss">
.body {
  width: 100%;
  height: 1px;
  background-color: var(--c-stroke-2);
}
</style>
