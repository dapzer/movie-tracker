<script setup lang="ts">
import { UiTypography } from "~/components/ui/UiTypography"

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
@import "~/styles/mixins";

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
    .icon {
      width: 20px;
      height: 20px;
    }

    &.small {
      &,
      .icon {
        width: 16px;
        height: 16px;
      }
    }
  }

  input {
    @include input;
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
