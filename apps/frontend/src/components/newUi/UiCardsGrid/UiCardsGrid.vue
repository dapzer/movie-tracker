<script setup lang="ts">

</script>

<template>
  <div :class="$style.wrapper">
    <slot />
  </div>
</template>

<style module lang="scss">
@import "~/styles/mixins";
@import "~/styles/newVariables";

.wrapper {
  display: grid;
  grid-template-columns: repeat(6, 1fr);
  gap: 6px;
  justify-content: center;

  @include tabletDevice {
    grid-template-columns: repeat(5, 1fr);
  }

  @include mobileDevice {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
