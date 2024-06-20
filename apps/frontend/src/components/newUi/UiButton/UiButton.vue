<script setup lang="ts">
export type UiButtonType = "boxed" | "outlined" | "text"
export type UiButtonSize = "small" | "medium" | "large"
export type UiButtonScheme = "primary" | "secondary" | "tertiary" | "link"

interface UiButtonProps {
  type?: UiButtonType
  size?: UiButtonSize
  scheme?: UiButtonScheme
}

const props = withDefaults(defineProps<UiButtonProps>(), {
  type: "boxed",
  scheme: "primary",
  size: "medium"
})
</script>

<template>
  <button
    :class="[$style.default, {
      [$style.primary]: props.scheme === 'primary',
      [$style.secondary]: props.scheme === 'secondary',
      [$style.tertiary]: props.scheme === 'tertiary',
      [$style.link]: props.scheme === 'link',
      [$style.boxed]: props.type === 'boxed',
      [$style.text]: props.type === 'text',
      [$style.outlined]: props.type === 'outlined',
      [$style.small]: props.size ==='small',
      [$style.medium]: props.size ==='medium',
      [$style.large]: props.size ==='large',
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

.boxed {
  &.primary {
    color: var(--c-text);
    background: var(--c-button-background-primary);

    &:active,
    &:hover {
      background: var(--c-button-background-primary-hovered);
    }
  }

  &.secondary {
    color: var(--c-label-secondary);
    background: var(--c-button-background-secondary);

    &:active,
    &:hover {
      background: var(--c-button-background-secondary-hovered);
    }
  }

  &.tertiary {
    color: var(--c-label-tertiary);
    background: var(--c-button-background-tertiary);

    &:active,
    &:hover {
      background: var(--c-button-background-tertiary-hovered);
    }
  }

  &.large {
    padding: 12px 24px;
    border-radius: var(--s-border-radius-medium);
  }

  &.medium {
    padding: 8px 12px;
    border-radius: var(--s-border-radius-medium);
  }

  &.small {
    padding: 8px 20px;
    border-radius: var(--s-border-radius-medium);
  }
}

.text {
  &.primary {
    color: var(--c-text);

    &:active,
    &:hover {
    }
  }

  &.secondary {
    color: var(--c-label-secondary);

    &:active,
    &:hover {
    }
  }

  &.tertiary {
    color: var(--c-label-tertiary);

    &:active,
    &:hover {
    }
  }

  &.link {
    color: var(--c-label-link);

    &:active,
    &:hover {
      color: var(--c-label-lihk-hovered);
    }
  }

  &.large {
  }

  &.medium {
  }

  &.small {
  }
}

</style>
