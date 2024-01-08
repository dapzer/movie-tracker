<script lang="ts" setup>
interface UiSwitchProps {
  isDisabled?: boolean;
}

const props = defineProps<UiSwitchProps>();
const inputModel = defineModel();
</script>

<template>
  <label
    :class="[$style.switch, {
      [$style.disabled]: props.isDisabled
    }]"
  >
    <input
      v-model="inputModel"
      :disabled="props.isDisabled"
      type="checkbox"
    >
    <span :class="$style.slider" />
  </label>
</template>

<style lang="scss" module>
.switch {
  --button-width: 52px;
  --button-height: 24px;
  --toggle-diameter: 16px;
  --button-toggle-offset: calc((var(--button-height) - var(--toggle-diameter)) / 2);
  --toggle-shadow-offset: 10px;
  --toggle-wider: 44px;
  --color-grey: var(--c-primary);
  --color-green: var(--c-highlight);

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

.disabled {
  pointer-events: none;
  opacity: 0.6;
}

.slider {
  display: inline-block;
  width: var(--button-width);
  height: var(--button-height);
  background-color: var(--color-grey);
  border-radius: calc(var(--button-height) / 2);
  position: relative;
  transition: 0.3s all ease-in-out;

  &::after {
    content: "";
    display: inline-block;
    width: var(--toggle-diameter);
    height: var(--toggle-diameter);
    background-color: #fff;
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
}

.switch input[type="checkbox"]:checked + .slider::after {
  transform: translateX(calc(var(--button-width) - var(--toggle-diameter) - var(--button-toggle-offset) + 0px));
  box-shadow: calc(var(--toggle-shadow-offset) * -1) 0 calc(var(--toggle-shadow-offset) * 4) rgba(0, 0, 0, 0.1);
}

.switch input[type="checkbox"] {
  display: none;
}

</style>
