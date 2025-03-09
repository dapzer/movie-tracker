<script lang="ts" setup>
import { computed } from "#imports"

interface UiLoadingIndicatorProps {
  size?: number
  thickness?: number
}

const props = withDefaults(
  defineProps<UiLoadingIndicatorProps>(),
  {
    thickness: 3,
  },
)

const computedStyle = computed(() => {
  return {
    size: props.size ? `${props.size}px` : "inherit",
    thickness: `${props.thickness}px`,
  }
})
</script>

<template>
  <div :class="$style.body" />
</template>

<style lang="scss" module>
.body {
  width: 100%;
  max-width: 1em;
  min-width: 1em;
  height: 1em;
  font-size: v-bind("computedStyle.size");
  line-height: 1;
  border: v-bind("computedStyle.thickness") solid var(--c-text);
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
