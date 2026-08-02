<script setup lang="ts">

</script>

<template>
  <div :class="$style.wrapper">
    <slot />
  </div>
</template>

<style module lang="scss">
@use "~/shared/styles/breakpoints" as *;
@use "~/shared/styles/mixins" as *;

.wrapper {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  row-gap: 40px;

  @include tabletDevice {
    grid-template-columns: repeat(2, 1fr);
    gap: 20px;
  }

  @include mobileDevice {
    grid-template-columns: 1fr;
    gap: 16px;
  }
}
</style>
