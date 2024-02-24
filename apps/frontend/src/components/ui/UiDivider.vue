<script setup lang="ts">
interface UiDividerProps {
  height?: number
}

const props = withDefaults(defineProps<UiDividerProps>(), {
  height: 1
})
</script>

<template>
  <hr
    :class="$style.body"
    :style="{ '--height': `${props.height}px` }"
  >
</template>

<style module lang="scss">
.body {
  border: none;
  width: 100%;
  height: var(--height);
  background: var(--c-text);
  opacity: var(--s-disabled-opacity);
  border-radius: var(--s-border-radius);
}
</style>
