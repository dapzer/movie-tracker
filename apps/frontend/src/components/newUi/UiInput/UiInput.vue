<script setup lang="ts">
import { UiTypography } from "~/components/newUi/UiTypography"

export type UiInputSize = "small" | "default"

interface UiInputProps {
  error?: string | string[]
  size?: UiInputSize
}

const props = defineProps<UiInputProps>()
const inputModel = defineModel<string>()

defineOptions({
  inheritAttrs: false
})

const slots = defineSlots()
</script>

<template>
  <label :class="[$style.wrapper]">
    <div :class="$style.inputWrapper">
      <template v-if="slots.icon">
        <div
          v-if="slots.icon"
          :class="[$style.icon, {
            [$style.small]: props.size === 'small'
          }]"
        >
          <slot name="icon" />
        </div>
      </template>
      <input
        v-bind="$attrs"
        v-model="inputModel"
        :class="{
          [$style.withIcon]: !!slots.icon,
          [$style.errored]: !!props.error,
          [$style.small]: props.size === 'small'
        }"
      >
    </div>


    <UiTypography
      v-if="props.error"
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
  width: 100%;
  
  .inputWrapper {
    position: relative;
    width: 100%;
  }

  .icon {
    position: absolute;
    top: 50%;
    transform: translateY(-50%);
    left: 10px;
    z-index: 1;

    &,
    svg {
      width: 20px;
      height: 20px;
    }

    &.small {
      &,
      svg {
        width: 16px;
        height: 16px;
      }
    }
  }

  input {
    background: transparent;
    padding: 10px 14px;
    font-size: var(--fs-input);
    line-height: var(--lh-input);
    height: 44px;
    font-family: var(--ff-inter);
    color: var(--c-text);
    outline: none;
    border: 1px solid var(--c-stroke);
    border-radius: var(--s-border-radius-medium);
    width: 100%;

    &.withIcon {
      padding-left: 38px;
    }

    &.small {
      padding: 8px 10px;
      font-size: var(--fs-input-small);
      line-height: var(--lh-input-small);
      height: 36px;
      &.withIcon {
        padding-left: 34px;
      }
    }

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
