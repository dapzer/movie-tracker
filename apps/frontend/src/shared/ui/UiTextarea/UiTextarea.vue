<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

export interface UiTextareaProps {
  error?: string | string[]
  description?: string
  height?: number
}

const props = withDefaults(defineProps<UiTextareaProps>(), {
  height: 92
});

const inputModel = defineModel<string>()
defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <label :class="[$style.wrapper]">
    <textarea
      v-bind="$attrs"
      v-model="inputModel"
      :style="{'--height': `${props.height}px`}"
      :class="{
        [$style.errored]: !!props.error
      }"
    />

    <span :class="$style.footer">
      <UiTypography
        :class="$style.error"
        as="span"
      >
        {{ Array.isArray(props.error) ? props.error.join(". ") : props.error }}
      </UiTypography>

      <UiTypography
        :class="$style.description"
        variant="description"
        as="span"
      >
        {{ props.description }}
      </UiTypography>
    </span>
  </label>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;

  textarea {
    height: var(--height);
    resize: none;
    background: transparent;
    padding: 10px 14px;
    font-size: var(--fs-input);
    line-height: var(--lh-input);
    font-family: var(--ff-inter);
    color: var(--c-text);
    outline: none;
    border: 1px solid var(--c-stroke);
    border-radius: var(--s-border-radius-medium);
    overflow: auto;

    @include scrollbar();

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

  .footer {
    display: flex;
    justify-content: space-between;
    gap: 8px;
    align-items: center;

    .description {
      align-self: flex-end;
      @include ellipsisText();
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
