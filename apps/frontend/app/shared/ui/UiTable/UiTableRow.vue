<script setup lang="ts">

</script>

<template>
  <tr :class="$style.body">
    <slot />
  </tr>
</template>

<style module lang="scss">
.body:not(:last-child) {
  border-bottom: 1px solid var(--c-stroke);
}
</style>
