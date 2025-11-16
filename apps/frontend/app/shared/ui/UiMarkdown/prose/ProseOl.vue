<script setup lang="ts">
</script>

<template>
  <ol :class="$style.wrapper">
    <slot />
  </ol>
</template>

<style module lang="scss">
.wrapper {
  li {
    list-style-position: inside;
    list-style-type: decimal;
  }

  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
