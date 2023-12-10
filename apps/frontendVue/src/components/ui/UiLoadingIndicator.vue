<script lang="ts" setup>
import { computed } from "#imports";

interface UiLoadingIndicatorProps {
  size?: number;
  thickness?: number;
}

const props = withDefaults(
  defineProps<UiLoadingIndicatorProps>(), {
    size: 48,
    thickness: 5
  }
);

const computedStyle = computed(() => {
  return {
    size: `${props.size}px`,
    thickness: `${props.thickness}px`
  }
})
</script>

<template>
  <div :class="$style.body" />
</template>

<style lang="scss" module>
.body {
  width: 100%;
  max-width: v-bind('computedStyle.size');
  min-width: v-bind('computedStyle.size');
  height: v-bind('computedStyle.size');
  border: v-bind('computedStyle.thickness') solid var(--c-secondary);
  border-bottom-color: transparent;
  border-radius: 50%;
  animation: rotation 1s linear infinite;
}

@keyframes rotation {
  0% {
    transform: rotate(0deg);
  }
  100% {
    transform: rotate(360deg);
  }
}

</style>
