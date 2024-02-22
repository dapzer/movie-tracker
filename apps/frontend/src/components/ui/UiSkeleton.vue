<script lang="ts" setup>
import { computed } from "#imports";

interface CardSkeletonProps {
  width?: number;
  height?: number;
  isCircle?: boolean;
  isFixedWidth?: boolean;
}

const props = defineProps<CardSkeletonProps>();

const styles = computed(() => {
  return {
    width: props.width ? `${props.width}px` : "unset",
    height: props.height ? `${props.height}px` : "inherit",
    minWidth: props.isFixedWidth ? `${props.width}px` : "unset",
  };
});

</script>

<template>
  <span
    :style="{
      '--width': styles.width,
      '--minWidth': styles.minWidth,
      '--height': styles.height
    }"
    :class="[$style.body, {
      [$style.circle]: isCircle
    }]"
  >
    &zwnj;
  </span>
</template>

<style lang="scss" module>
.body {
  width: 100%;
  font-size: var(--height);
  max-width: var(--width);
  min-width: var(--minWidth);
  background-color: var(--c-accent);
  line-height: 1;
  display: block;
  animation: pulse-bg 1.75s infinite;
  border-radius: var(--s-border-radius);

  @keyframes pulse-bg {
    0% {
      background-color: var(--c-loader-accent);
    }

    50% {
      background-color: var(--c-primary);
    }

    100% {
      background-color: var(--c-loader-accent);
    }
  }
}

.circle {
  border-radius: 50%;
}
</style>
