<script setup lang="ts">
export type UiTableCellAlign = "left" | "center" | "right"

interface UiTableCellProps {
  width?: number
  align?: UiTableCellAlign
}

const props = defineProps<UiTableCellProps>()
</script>

<template>
  <td
    :class="[$style.body, {
      [$style.maxWidth]: props.width,
    }]"
    :style="{
      '--width': props.width ? `${props.width}px` : 'auto',
      '--align': props.align || 'left',
    }"
  >
    <slot />
  </td>
</template>

<style module lang="scss">
.body {
  padding: 16px;
  font-size: var(--fs-label);
  color: var(--c-text);
  font-weight: var(--fw-regular);
  text-align: var(--align);
  vertical-align: middle;
}

.maxWidth {
  //max-width: var(--width);
  width: var(--width);
}
</style>
