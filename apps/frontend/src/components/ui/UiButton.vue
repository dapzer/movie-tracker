<script lang="ts" setup>
import UiLoadingIndicator from "~/components/ui/UiLoadingIndicator.vue";

export type ButtonVariant = "default" | "clear" | "outlined";
export type ButtonColorScheme = "danger" | "success" | "afterSuccess";
export type ButtonSize = "small";

interface UiButtonProps {
  variant?: ButtonVariant;
  colorScheme?: ButtonColorScheme;
  size?: ButtonSize;
  isLoading?: boolean;
  loadingIndicatorThickness?: number;
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
        [$style.loading]: props.isLoading,
        [$style.danger]: props.colorScheme === 'danger',
        [$style.success]: props.colorScheme === 'success',
        [$style.afterSuccess]: props.colorScheme === 'afterSuccess',
        [$style.clear]: props.variant === 'clear',
        [$style.outlined]: props.variant === 'outlined',
        [$style.small]: props.size === 'small',
      },
    ]"
  >
    <UiLoadingIndicator
      v-if="props.isLoading"
      :thickness="props.loadingIndicatorThickness"
    />
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

  display: inline-flex;
  gap: 10px;
  align-items: center;
  justify-content: center;

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

    &.success {
      color: var(--c-secondary);
      background-color: var(--c-success);
    }
  }
}

.afterSuccess {
  pointer-events: none;
  background-color: var(--c-success);
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

.small {
  padding: 4px 8px;
}

.loading {
  pointer-events: none;
}
</style>
