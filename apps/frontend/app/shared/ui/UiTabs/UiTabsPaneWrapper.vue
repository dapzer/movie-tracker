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
  position: relative;
  padding: 0 16px;

  &:after {
    content: "";
    position: absolute;
    bottom: 0;
    left: 0;
    width: 100%;
    height: 1px;
    background-color: var(--c-white-15);
  }
}
</style>
