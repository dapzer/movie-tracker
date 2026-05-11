<script setup lang="ts">
import { useMediaQuery } from "@vueuse/core"
import { SliderThumb } from "radix-vue"
import { ref } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import UiTooltip from "~/shared/ui/UiTooltip/UiTooltip.vue"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiRangeSliderThumbTooltipProps {
  label: number | string
  disabled?: boolean
}

const props = defineProps<UiRangeSliderThumbTooltipProps>()
const tooltipOpen = ref<boolean>(false)
const mediaQueryTouch = useMediaQuery("(hover: none) and (pointer: coarse)")

function handleTouchStart() {
  if (mediaQueryTouch.value) {
    tooltipOpen.value = true
  }
}

function handleTouchEnd() {
  if (mediaQueryTouch.value) {
    tooltipOpen.value = false
  }
}
</script>

<template>
  <UiTooltip
    v-model="tooltipOpen"
    hide-arrow
    :disabled="props.disabled"
    side="bottom"
    align="center"
    as-child
    :offset="8"
    :content-class="$style.tooltip"
    :collision-padding="0"
    @touchstart="handleTouchStart"
    @touchend="handleTouchEnd"
  >
    <template #trigger>
      <SliderThumb
        :class="$style.thumb"
        :as="UiButton"
        scheme="default"
        variant="default"
        :aria-label="props.label"
      />
    </template>

    <template #content>
      <UiTypography
        as="span"
        variant="labelSmall"
      >
        {{ props.label }}
      </UiTypography>
    </template>
  </UiTooltip>
</template>

<style module lang="scss">
.thumb {
  width: 16px;
  height: 16px;
  background: var(--c-text);
  border-radius: 9999px;
  cursor: pointer;
  outline: none;
  position: relative;
  z-index: 2;

  &[data-disabled] {
    opacity: var(--s-disabled-opacity);
  }

  &:hover,
  &:focus,
  &:active {
    background: var(--c-white-85);
  }
}

.tooltip {
  background: var(--c-button-background-primary);
  padding: 0 5px;
  border-radius: var(--s-border-radius-small);

  span {
    font-weight: var(--fw-semi-bold);
    font-size: var(--fs-badge);
  }
}
</style>
