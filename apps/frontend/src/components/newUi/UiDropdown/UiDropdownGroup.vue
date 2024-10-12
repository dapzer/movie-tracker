<script setup lang="ts">

import { DropdownMenuGroup } from "radix-vue"
</script>

<template>
  <DropdownMenuGroup :class="$style.wrapper">
    <slot />
  </DropdownMenuGroup>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
