<script setup lang="ts" generic="T extends string">
import { ref } from "vue"

export interface UiSegmentedControlOption<T extends string = string> {
  label: string
  value: T
}

interface UiSegmentedControlProps {
  options: UiSegmentedControlOption<T>[]
  disabled?: boolean
}

const props = defineProps<UiSegmentedControlProps>()

const model = defineModel<T>()

const optionElements = ref<HTMLButtonElement[]>([])

function getFocusedIndex() {
  const modelIndex = props.options.findIndex(option => option.value === model.value)
  return modelIndex === -1 ? 0 : modelIndex
}

function onKeydown(event: KeyboardEvent) {
  if (props.disabled) {
    return
  }

  const currentIndex = getFocusedIndex()
  let nextIndex: number | null = null

  switch (event.key) {
    case "ArrowLeft":
    case "ArrowUp":
      nextIndex = (currentIndex - 1 + props.options.length) % props.options.length
      break
    case "ArrowRight":
    case "ArrowDown":
      nextIndex = (currentIndex + 1) % props.options.length
      break
    case "Home":
      nextIndex = 0
      break
    case "End":
      nextIndex = props.options.length - 1
      break
  }

  if (nextIndex === null) {
    return
  }

  event.preventDefault()

  const nextValue = props.options[nextIndex]?.value

  if (nextValue === undefined) {
    return
  }

  model.value = nextValue
  optionElements.value[nextIndex]?.focus()
}
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.disabled]: props.disabled,
    }]"
    role="radiogroup"
    @keydown="onKeydown"
  >
    <button
      v-for="(option, index) in props.options"
      :key="option.value"
      ref="optionElements"
      type="button"
      role="radio"
      :aria-checked="model === option.value"
      :tabindex="index === getFocusedIndex() ? 0 : -1"
      :disabled="props.disabled"
      :class="[$style.option, {
        [$style.active]: model === option.value,
      }]"
      @click="model = option.value"
    >
      {{ option.label }}
    </button>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  width: 100%;
  padding: 2px;
  background-color: var(--c-white-10);
  border-radius: var(--s-border-radius);

  &.disabled {
    pointer-events: none;
    opacity: var(--s-disabled-opacity);
  }
}

.option {
  flex: 1;
  padding: 7px 12px;
  background: unset;
  border: unset;
  outline: unset;
  border-radius: var(--s-border-radius-medium);
  cursor: pointer;
  font-family: var(--ff-inter);
  font-size: var(--fs-label-small);
  line-height: var(--lh-label-small);
  font-weight: var(--fw-medium);
  color: var(--c-description);
  border: 1px solid transparent;
  transition:
    background-color 0.2s ease-in-out,
    color 0.2s ease-in-out;

  &:hover:not(.active),
  &:active:not(.active) {
    color: var(--c-text);
  }

  &:focus-visible {
    outline: 1px solid var(--c-blue);
    outline-offset: -1px;
  }

  &.active {
    background-color: var(--c-button-background-primary-20);
    border: 1px solid var(--c-button-background-primary-30);
    color: var(--c-blue);
  }

  &:disabled {
    cursor: default;
  }
}
</style>
