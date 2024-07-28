<script setup lang="ts">
interface UiDividerProps {
  height?: number
  vertical?: boolean
  width?: number
}

const props = withDefaults(defineProps<UiDividerProps>(), {
  height: 1
})
</script>

<template>
  <hr
    :class="[$style.body, {
      [$style.vertical]: props.vertical
    }]"
    :style="{ '--height': `${props.height}px`, '--width': props.width ? `${props.width}px` : 'unset' }"
  >
</template>

<style module lang="scss">
.body {
  border: none;
  width: 100%;
  height: var(--height);
  background: var(--c-stroke);

  &.vertical {
    width: var(--width);
    height: var(--height);
    max-width: unset;
    min-height: 100%;
    display: flex;
  }
}
</style>
