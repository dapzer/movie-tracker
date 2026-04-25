<script setup lang="ts">
import { SliderRange, SliderRoot, SliderThumb, SliderTrack } from "radix-vue"
import { computed } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiRangeSliderProps {
  min?: number
  max?: number
  step?: number
  disabled?: boolean
}

const props = withDefaults(defineProps<UiRangeSliderProps>(), {
  min: 0,
  max: 10,
  step: 1,
})

const model = defineModel<[number, number]>({ default: () => [0, 10] })

const THUMB_SIZE = 16

function getThumbInBoundsOffset(width: number, percent: number) {
  const halfWidth = width / 2
  const halfPercent = 50
  const offset = (left: number) => {
    const ratio = halfWidth / halfPercent
    return ratio * left
  }
  return (halfWidth - offset(percent))
}

const ticks = computed(() => {
  const result = []
  for (let v = props.min; v <= props.max; v += props.step) {
    const percent = (v - props.min) / (props.max - props.min) * 100
    const offset = getThumbInBoundsOffset(THUMB_SIZE, percent)
    result.push({ percent, offset })
  }
  return result
})
</script>

<template>
  <div :class="$style.wrapper">
    <SliderRoot
      v-model="model"
      :class="$style.root"
      :min="props.min"
      :max="props.max"
      :step="props.step"
      :disabled="props.disabled"
      :min-steps-between-thumbs="1"
    >
      <SliderTrack :class="$style.track">
        <SliderRange :class="$style.range" />
      </SliderTrack>

      <span
        v-for="(tick, i) in ticks"
        :key="i"
        :class="$style.tick"
        :style="{ '--left': `calc(${tick.percent}% + ${tick.offset}px)` }"
      />

      <SliderThumb
        v-for="(value, i) in model"
        :key="i"
        :class="$style.thumb"
        :aria-label="`Value ${i + 1}`"
        :as="UiButton"
        scheme="default"
        variant="default"
      >
        <div :class="$style.tooltip">
          <UiTypography
            as="span"
            variant="labelSmall"
          >
            {{ value }}
          </UiTypography>
        </div>
      </SliderThumb>
    </SliderRoot>

    <div :class="$style.labels">
      <UiTypography
        as="span"
        variant="description"
        :class="$style.label"
      >
        {{ props.min }}
      </UiTypography>
      <UiTypography
        as="span"
        variant="description"
        :class="$style.label"
      >
        {{ props.max }}
      </UiTypography>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;
  width: 100%;
}

.root {
  position: relative;
  display: flex;
  align-items: center;
  width: 100%;
  height: 20px;
  user-select: none;
  touch-action: none;

  &[data-disabled] {
    .track,
    .thumb,
    .tick {
      opacity: 0.6;
    }
  }
}

.track {
  background: var(--c-charcoal);
  position: relative;
  flex-grow: 1;
  border-radius: 9999px;
  height: 3px;
  overflow: visible;
}

.tick {
  position: absolute;
  left: var(--left);
  top: 50%;
  transform: translate(-50%, -50%);
  width: 2px;
  height: 16px;
  background: var(--c-white-15);
  pointer-events: none;
  border-radius: 20px;
  z-index: -1;
}

.range {
  position: absolute;
  background: var(--c-button-background-primary);
  border-radius: 9999px;
  height: 100%;
}

.thumb {
  width: 16px;
  height: 16px;
  background: var(--c-text);
  border-radius: 9999px;
  cursor: pointer;
  outline: none;
  position: relative;

  &:hover,
  &:focus,
  &:active {
    background: var(--c-white-85);

    .tooltip {
      opacity: 1;
      transform: translateX(-50%) translateY(0);
    }
  }
}

.tooltip {
  position: absolute;
  top: calc(100% + 8px);
  left: 50%;
  transform: translateX(-50%) translateY(-4px);
  background: var(--c-button-background-primary);
  padding: 0 5px;
  border-radius: var(--s-border-radius-small);
  pointer-events: none;
  opacity: 0;
  transition:
    opacity 0.15s ease,
    transform 0.15s ease;

  span {
    font-weight: var(--fw-semi-bold);
    font-size: var(--fs-badge);
  }
}

.labels {
  display: flex;
  justify-content: space-between;
  gap: 8px;
}

.label {
  font-weight: var(--fw-medium);
  color: var(--c-white-60);
}
</style>
