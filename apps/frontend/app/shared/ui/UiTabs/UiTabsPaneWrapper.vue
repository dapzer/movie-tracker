<script setup lang="ts">

</script>

<template>
  <div :class="$style.wrapper">
    <slot />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: row;
  gap: 24px;
  justify-content: space-between;
}
</style>
