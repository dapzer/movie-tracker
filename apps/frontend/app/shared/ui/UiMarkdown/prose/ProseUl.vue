<script setup lang="ts">
</script>

<template>
  <ul :class="$style.wrapper">
    <slot />
  </ul>
</template>

<style module lang="scss">
.wrapper {
  li {
    list-style-position: inside;
    list-style-type: disc;
  }

  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
