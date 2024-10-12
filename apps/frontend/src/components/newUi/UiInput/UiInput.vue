<script setup lang="ts">
import { UiTypography } from "~/components/newUi/UiTypography"

interface UiInputProps {
  error?: string | string[]
}

const props = defineProps<UiInputProps>()
const inputModel = defineModel<string>()

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <label :class="[$style.wrapper]">
    <input
      v-bind="$attrs"
      v-model="inputModel"
      :class="{
        [$style.errored]: !!props.error
      }"
    >

    <UiTypography
      :class="$style.error"
      as="span"
    >
      {{ Array.isArray(props.error) ? props.error.join(". ") : props.error }}
    </UiTypography>
  </label>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;

  input {
    background: transparent;
    padding: 10px 14px;
    font-size: var(--fs-input);
    line-height: var(--lh-input);
    font-family: var(--ff-inter);
    color: var(--c-text);
    outline: none;
    border: 1px solid var(--c-stroke);
    border-radius: var(--s-border-radius-medium);

    &.errored {
      border-color: var(--c-error-2);
    }

    &:active:not(:disabled),
    &:focus {
      background: var(--c-card-background-hovered);
      border-color: var(--c-label-secondary);
    }

    &:disabled {
      opacity: var(--s-disabled-opacity);
    }
  }

  .error {
    color: var(--c-error);
    font-size: var(--fs-input-error);
    line-height: var(--lh-input-error);
    font-weight: var(--fw-regular);
    font-family: var(--ff-inter);
  }
}
</style>
