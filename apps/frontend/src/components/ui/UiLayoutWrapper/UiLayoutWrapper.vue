<script setup lang="ts">

</script>

<template>
  <div :class="$style.body">
    <slot />
  </div>
</template>

<style module lang="scss">
.body {
  display: flex;
  flex-direction: column;
  min-height: 100%;

  main {
    padding: var(--s-header-height) 0;
    flex: 1 1 auto;

    @media screen and (max-width: var(--bp-md)) {
      min-height: 100vh;
    }
  }
}
</style>
