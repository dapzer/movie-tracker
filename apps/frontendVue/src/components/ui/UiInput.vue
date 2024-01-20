<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import { CloseIcon } from "~/components/ui/icons";
import UiButton from "~/components/ui/UiButton.vue";

type Variant = "underlined" | "boxed";

const props = defineProps<{
  variant?: Variant
  error?: string
  isShowClearButton?: boolean
}>();

const emit = defineEmits<{
  (e: "onClickClear"): void
}>();

const inputModel = defineModel()
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.error]: props.error
    }]"
  >
    <div :class="$style.bodyWrapper">
      <input
        v-bind="$attrs"
        v-model="inputModel"
        :class="[$style.body, {
          [$style.underlined]: props.variant === 'underlined',
          [$style.boxed]: props.variant === 'boxed',
          [$style.withClearButton]: props.isShowClearButton
        }]"
      >
      <UiButton
        v-if="props.isShowClearButton"
        :class="$style.clearIcon"
        variant="clear"
        @click="emit('onClickClear')"
      >
        <CloseIcon />
      </UiButton>
    </div>

    <UiTypography
      v-if="props.error"
      :class="$style.errorText"
      variant="textSmall"
      as="span"
    >
      {{ error }}
    </UiTypography>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 8px;

  &.error {
    .boxed {
      border: 1px solid var(--c-danger);
    }

    .body {
      border-color: var(--c-danger);
    }

    .errorText {
      color: var(--c-danger);
      font-weight: var(--fw-regular);
    }
  }
}

.bodyWrapper {
  width: 100%;
  position: relative;

  .withClearButton {
    padding-right: 42px;
  }

  .clearIcon {
    position: absolute;
    display: flex;
    align-items: center;
    justify-content: center;
    right: 20px;
    top: 50%;
    transform: translateY(-50%);
    width: 16px;
    height: 16px;
    color: var(--c-text);
  }
}

.body {
  background: none;
  text-decoration: none;
  outline: none;
  border: 1px solid var(--c-text);
  padding: 10px 16px;
  color: var(--c-secondary);
  font-size: var(--fs-p);
  border-radius: var(--s-border-radius);
  width: 100%;
}

.underlined {
  font-size: var(--fs-span);
  border-radius: unset;
  border: none;
  border-bottom: 1px solid var(--c-text);
}

.boxed {
  background-color: var(--c-primary);
  color: var(--c-secondary);
  border-radius: unset;
  border: unset;

  &:disabled {
    opacity: var(--s-disabled-opacity);
  }

  &::placeholder {
    color: var(--c-text);
  }
}
</style>
