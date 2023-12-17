<script lang="ts" setup>
export type ButtonVariant = "default" | "clear" | "outlined";
type ColorScheme = "danger";

interface UiButtonProps {
  variant?: ButtonVariant;
  colorScheme?: ColorScheme;
}

const props = withDefaults(defineProps<UiButtonProps>(), {
  variant: "default"
});

</script>
<template>
  <button
    :class="[
      $style.body,
      $style.default,
      {
        [$style.danger]: props.colorScheme === 'danger',
        [$style.clear]: props.variant === 'clear',
        [$style.outlined]: props.variant === 'outlined',
      },
    ]"
  >
    <slot />
  </button>
</template>

<style lang="scss" module>
.body {
  cursor: pointer;
  border: none;
  padding: 8px 16px;
  color: var(--c-secondary);
  background: var(--c-primary);
  font-size: var(--fs-p);
  transition-property: color, border;
  transition-duration: 0.2s;
  transition-timing-function: linear;

  &:disabled {
    cursor: default;
    opacity: var(--s-disabled-opacity);
  }
}

.default {
  &:hover:not(:disabled) {
    color: var(--c-highlight);
    border-color: var(--c-highlight);

    &.danger {
      color: var(--c-secondary);
      background-color: var(--c-danger);
    }
  }
}

.outlined {
  background: none;
  box-shadow: inset 0 0 0 1px;
}

.clear {
  box-shadow: none;
  border: none;
  background: none;
  padding: unset;
}
</style>
