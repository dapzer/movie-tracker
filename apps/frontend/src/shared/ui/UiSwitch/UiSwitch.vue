<script setup lang="ts">
import { useAttrs } from "#imports"

defineOptions({
  inheritAttrs: false,
})

const inputModel = defineModel()

const attrs = useAttrs()
</script>

<template>
  <label
    :class="[$style.switch, {
      [$style.disabled]: attrs.disabled,
    }]"
  >
    <input
      v-model="inputModel"
      v-bind="$attrs"
      type="checkbox"
    >
    <span :class="$style.slider" />
  </label>
</template>

<style lang="scss" module>
.switch {
  --button-width: 48px;
  --button-height: 24px;
  --toggle-diameter: 16px;
  --button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
  --toggle-shadow-offset: 10px;
  --toggle-wider: 40px;
  --color-grey: var(--c-card-background);
  --color-green: var(--c-button-background-primary);

  width: fit-content;
  display: inline-block;
  cursor: pointer;

  &:not(.disabled) {
    input[type="checkbox"]:active + .slider::after {
      width: var(--toggle-wider);
    }

    input[type="checkbox"]:checked:active + .slider::after {
      transform: translateX(calc(var(--button-width) - var(--toggle-wider) - var(--button-toggle-offset) + 0px));
    }
  }
}

.slider {
  display: inline-block;
  width: var(--button-width);
  height: var(--button-height);
  background-color: var(--color-grey);
  border-radius: 31px;
  position: relative;
  transition: 0.3s all ease-in-out;

  &::after {
    content: "";
    display: inline-block;
    width: var(--toggle-diameter);
    height: var(--toggle-diameter);
    background-color: var(--c-description);
    border-radius: calc(var(--toggle-diameter) / 2);
    position: absolute;
    top: var(--button-toggle-offset);
    transform: translateX(var(--button-toggle-offset));
    box-shadow: var(--toggle-shadow-offset) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
    transition: 0.3s all ease-in-out;
  }
}

.switch input[type="checkbox"]:checked + .slider {
  background-color: var(--color-green);

  &::after {
    background: var(--c-text);
  }
}

.disabled {
  pointer-events: none;
  opacity: var(--s-disabled-opacity);
}

.switch input[type="checkbox"]:checked + .slider::after {
  transform: translateX(calc(var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset) + 0px));
  box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
}

.switch input[type="checkbox"] {
  display: none;
}
</style>
