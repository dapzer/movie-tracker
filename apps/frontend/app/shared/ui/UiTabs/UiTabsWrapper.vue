<script setup lang="ts">

</script>

<template>
  <div :class="$style.wrapper">
    <slot />
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
