<script setup lang="ts">
import type { ComponentOrTag } from "~/shared/types/ComponentOrTag"

export type UiButtonVariant = "default" | "boxed" | "outlined" | "text" | "icon" | "rounded" | "textIcon"
export type UiButtonSize = "small" | "medium" | "large"
export type UiButtonScheme = "default" | "primary" | "secondary" | "tertiary" | "link" | "gold" | "gray"

interface UiButtonProps {
  variant?: UiButtonVariant
  size?: UiButtonSize
  scheme?: UiButtonScheme
  withIcon?: boolean
  as?: ComponentOrTag
}

const props = withDefaults(defineProps<UiButtonProps>(), {
  variant: "boxed",
  scheme: "primary",
  size: "medium",
  as: "button",
})
</script>

<template>
  <component
    :is="props.as"
    :class="[$style.default, {
      [$style.primary]: props.scheme === 'primary',
      [$style.secondary]: props.scheme === 'secondary',
      [$style.tertiary]: props.scheme === 'tertiary',
      [$style.gold]: props.scheme === 'gold',
      [$style.gray]: props.scheme === 'gray',
      [$style.link]: props.scheme === 'link',
      [$style.boxed]: props.variant === 'boxed',
      [$style.text]: props.variant === 'text',
      [$style.textIcon]: props.variant === 'textIcon',
      [$style.outlined]: props.variant === 'outlined',
      [$style.rounded]: props.variant === 'rounded',
      [$style.icon]: props.variant === 'icon',
      [$style.small]: props.size === 'small',
      [$style.medium]: props.size === 'medium',
      [$style.large]: props.size === 'large',
      [$style.withIcon]: props.withIcon,
    }]"
  >
    <slot />
  </component>
</template>

<style module lang="scss">
@layer default, external, scheme;

@layer default {
  .default {
    background: unset;
    border: unset;
    outline: unset;
    cursor: pointer;
    font-family: var(--ff-inter);
    font-size: var(--fs-label);
    line-height: var(--lh-label);
    font-weight: var(--fw-medium);
    width: fit-content;

    &:disabled {
      pointer-events: none;
      opacity: var(--s-disabled-opacity);
    }
  }
}

@layer scheme {
  .boxed {
    &.primary {
      color: var(--c-text);
      background: var(--c-button-background-primary);

      &:focus,
      &:active,
      &:hover {
        background: var(--c-button-background-primary-hovered);
      }
    }

    &.secondary {
      color: var(--c-label-secondary);
      background: var(--c-button-background-secondary);

      &:focus,
      &:active,
      &:hover {
        background: var(--c-button-background-secondary-hovered);
      }
    }

    &.tertiary {
      color: var(--c-label-tertiary);
      background: var(--c-button-background-tertiary);

      &:focus,
      &:active,
      &:hover {
        background: var(--c-button-background-tertiary-hovered);
      }
    }

    &.gold {
      color: var(--c-gold);
      background: var(--c-gold-15);

      &:focus,
      &:active,
      &:hover {
        background: var(--c-gold-20);
      }
    }

    &.gray {
      color: var(--c-white-75);
      background: var(--c-white-10);

      &:focus,
      &:active,
      &:hover {
        background: var(--c-white-15);
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

  .outlined {
    &.primary {
      color: var(--c-text-secondary);
      border: 1px solid var(--c-stroke);
      background: transparent;

      &:focus,
      &:active,
      &:hover {
        background: var(--c-stroke);
      }
    }

    &.secondary {
      color: var(--c-label-link);
      border: 1px solid var(--c-button-link-border);
      background: transparent;

      &:focus,
      &:active,
      &:hover {
        background: var(--c-button-background-secondary-hovered);
      }
    }

    &.tertiary {
    }

    &.large {
      padding: 8px 16px;
      border-radius: var(--s-border-radius-medium);
    }

    &.medium {
      padding: 7px 12px;
      border-radius: var(--s-border-radius-medium);
    }

    &.small {
    }
  }

  .text {
    &.primary {
      color: var(--c-text);

      &:focus,
      &:active,
      &:hover {
      }
    }

    &.secondary {
      color: var(--c-label-secondary);

      &:focus,
      &:active,
      &:hover {
      }
    }

    &.tertiary {
      color: var(--c-label-tertiary);

      &:focus,
      &:active,
      &:hover {
      }
    }

    &.link {
      color: var(--c-label-link);

      &:focus,
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

  .textIcon {
    display: flex;
    align-items: center;
    justify-content: center;

    &:active,
    &:focus,
    &:hover {
      border-radius: var(--s-border-radius-medium);
      background: var(--c-stroke);
    }

    &.primary {
      color: var(--c-text);

      &:focus,
      &:active,
      &:hover {
      }
    }

    &.secondary {
      color: var(--c-label-secondary);

      &:focus,
      &:active,
      &:hover {
      }
    }

    &.tertiary {
      color: var(--c-label-tertiary);

      &:focus,
      &:active,
      &:hover {
      }
    }

    &.link {
      color: var(--c-label-link);

      &:focus,
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

  .icon {
    aspect-ratio: 1 / 1;
    border-radius: 100%;
    display: flex;
    align-items: center;
    justify-content: center;

    &.primary {
      color: var(--c-text-secondary);
      border: 1px solid var(--c-stroke);
      background: transparent;

      &:focus,
      &:hover {
        background: var(--c-stroke);
      }

      &:active {
        background: var(--c-button-background-secondary-hovered);
        border-color: var(--c-button-background-secondary-hovered);
        color: var(--c-label-secondary);
      }
    }

    &.medium {
      width: 32px;
      height: 32px;
      padding: 7px;
    }

    &.small {
      width: 24px;
      height: 24px;
      padding: 4px;
    }
  }

  .rounded {
    display: flex;
    align-items: center;
    justify-content: center;

    &.primary {
      color: var(--c-white-80);
      background: linear-gradient(90deg, rgba(13, 13, 13, 0.9) 0%, rgba(23, 23, 23, 0.9) 100%);
      border: 1px solid var(--c-white-12);

      &:focus,
      &:active,
      &:hover {
        background: linear-gradient(90deg, rgba(23, 23, 23, 0.9) 0%, rgba(33, 33, 33, 0.9) 100%);
      }
    }

    &.medium {
      padding: 30px 10px;
      border-radius: 30px;
    }
  }

  .withIcon {
    display: flex;
    align-items: center;
    justify-content: center;
    gap: 4px;

    .icon {
      min-width: max-content;
      min-height: max-content;
    }
  }
}
</style>
