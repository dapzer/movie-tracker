<script setup lang="ts">

</script>

<template>
  <div :class="$style.wrapper">
    <table :class="$style.body">
      <slot />
    </table>
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  overflow-x: auto;
  border: 1px solid var(--c-stroke);
  border-radius: var(--s-border-radius);
}

.body {
  width: 100%;
  border-collapse: collapse;
  white-space: nowrap;
}
</style>
