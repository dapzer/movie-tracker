<script setup lang="ts">

</script>

<template>
  <span :class="$style.body">
    &zwnj;
  </span>
</template>

<style module lang="scss">
.body {
  width: 5px;
  height: 100%;
  position: relative;
  line-height: inherit;

  &::before {
    content: '';
    position: absolute;
    top: calc(50% - 2.5px);
    width: 5px;
    height: 5px;
    border-radius: 100%;
    background-color: var(--c-stroke);
  }
}
</style>
