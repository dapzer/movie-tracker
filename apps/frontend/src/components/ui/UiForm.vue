<script setup lang="ts">

</script>

<template>
  <form :class="$style.wrapper">
    <slot />
  </form>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  width: 100%;

  button[type="submit"] {
    margin-top: 14px;
  }
}
</style>
