<script setup lang="ts">
export type UiTableHeadAlign = "left" | "center" | "right"

interface UiTableHeadProps {
  width?: number
  align?: UiTableHeadAlign
}

const props = defineProps<UiTableHeadProps>()
</script>

<template>
  <th
    :class="[$style.body, {
      [$style.maxWidth]: props.width,
    }]"
    :style="{
      '--width': props.width ? `${props.width}px` : 'auto',
      '--align': props.align || 'left',
    }"
  >
    <slot />
  </th>
</template>

<style module lang="scss">
.body {
  color: var(--c-white-60);
  font-size: var(--fs-description);
  font-weight: var(--fw-medium);
  padding: 16px 12px;
  background: var(--c-tooltip-background);
  text-align: var(--align);
  vertical-align: middle;
  // ??? ellipsis
}

.maxWidth {
  //max-width: var(--width);
  width: var(--width);
}
</style>
