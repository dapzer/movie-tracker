<script setup lang="ts">
import { UiIcon } from "~/shared/ui/UiIcon"

export type UiCheckboxVariant = "circle" | "square"
export type UiCheckboxSize = "small" | "medium"

interface UiCheckboxProps {
  radio?: boolean
  size?: UiCheckboxSize
  variant?: UiCheckboxVariant
}

defineOptions({
  inheritAttrs: false,
})
const props = withDefaults(defineProps<UiCheckboxProps>(), {
  size: "medium",
  variant: "circle",
})
const inputModel = defineModel()
</script>

<template>
  <label
    :class="[$style.body, {
      [$style.square]: props.variant === 'square',
      [$style.small]: props.size === 'small',
    }]"
  >
    <input
      v-model="inputModel"
      :type="props.radio ? 'radio' : 'checkbox'"
      v-bind="$attrs"
    >
    <span :class="$style.transition">
      <UiIcon
        name="icon:check"
        :size="14"
      />
    </span>
  </label>
</template>

<style module lang="scss">
.body {
  display: block;
  cursor: pointer;
  width: 20px;
  min-width: 20px;
  height: 20px;
  border: 1.5px solid var(--c-white-35);
  border-radius: 50%;
  position: relative;
  overflow: hidden;

  .transition {
    display: none;
  }

  &.square {
    border-radius: var(--s-border-radius-small);
  }

  &.small {
    width: 16px;
    min-width: 16px;
    height: 16px;
  }

  &:has(input:active),
  &:has(input:focus),
  &:has(input:checked) {
    border-color: var(--c-label-secondary);
    outline: none;
  }

  &:has(input:disabled) {
    opacity: var(--s-disabled-opacity);
    pointer-events: none;
  }
}

.body input:checked + .transition {
  position: absolute;
  width: 100%;
  height: 100%;
  color: #030304;
  background: var(--c-label-secondary);
  left: 0;
  top: 0;
  bottom: 0;
  right: 0;
  display: flex;
  justify-content: center;
  align-items: center;
}

.body input {
  position: absolute;
  width: 0;
  height: 0;
}
</style>
