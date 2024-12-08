<script lang="ts" setup>
import { computed } from "#imports";

interface CardSkeletonProps {
  width?: number;
  height?: number;
  isCircle?: boolean;
  isFixedWidth?: boolean;
  isInline?: boolean;
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
      [$style.circle]: isCircle,
      [$style.inline]: isInline
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
  //background: linear-gradient(266.46deg, #151515 2.91%, #222222 62.84%, #282828 97.07%);
  line-height: 1;
  display: block;
  animation: pulse-bg 2.5s infinite;
  border-radius: var(--s-border-radius-small);

  &.inline {
    display: inline-block;
  }

  @keyframes move-gradient {
    0% {
      background-position: 0 50%;
    }
    100% {
      background-position: 100% 50%;
    }
  }

  @keyframes pulse-bg {
    0% {
      //background-color: var(--c-loader-accent);
      background-color: #282828;
    }

    50% {
      //background-color: var(--c-primary);
      background-color: #151515;
    }

    100% {
      //background-color: var(--c-loader-accent);
      background-color: #282828;
    }
  }
}

.circle {
  border-radius: 50%;
}
</style>
