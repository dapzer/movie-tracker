<script setup lang="ts">
export type UiButtonVariant = "primary" | "secondary" | "tertiary"

interface UiButtonProps {
  variant?: UiButtonVariant
}

const props = withDefaults(defineProps<UiButtonProps>(), {
  variant: "primary"
})
</script>

<template>
  <button
    :class="[$style.default, {
      [$style.primary]: props.variant === 'primary',
      [$style.secondary]: props.variant === 'secondary',
      [$style.tertiary]: props.variant === 'tertiary',
    }]"
  >
    <slot />
  </button>
</template>

<style module lang="scss">
.default {
  background: unset;
  border: unset;
  outline: unset;
  cursor: pointer;
  font-family: var(--ff-inter);
  font-size: var(--fs-label);
  line-height: var(--lh-label);
  width: fit-content;

  &:disabled {
    pointer-events: none;
    opacity: var(--s-disabled-opacity);
  }
}

.primary {
  color: var(--c-text);
  background: var(--c-button-background-primary);
  padding: 12px 24px;
  border-radius: var(--s-border-radius-medium);

  &:active,
  &:hover {
    background: var(--c-button-background-primary-hovered);
  }
}

.secondary {
  color: var(--c-label-secondary);
  background: var(--c-button-background-secondary);
  padding: 8px 12px;
  border-radius: var(--s-border-radius-medium);

  &:active,
  &:hover {
    background: var(--c-button-background-secondary-hovered);
  }
}

.tertiary {
  color: var(--c-label-tertiary);
  background: var(--c-button-background-tertiary);
  padding: 8px 20px;
  border-radius: var(--s-border-radius-medium);

  &:active,
  &:hover {
    background: var(--c-button-background-tertiary-hovered);
  }
}
</style>
