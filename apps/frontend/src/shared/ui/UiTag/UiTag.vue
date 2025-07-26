<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

export type UiTagColor = "gray" | "green" | "orange" | "blue"
export type UiTagVariant = "boxed"

interface UiTagProps {
  color?: UiTagColor
  variant?: UiTagVariant
}

const props = withDefaults(defineProps<UiTagProps>(), {
  color: "gray",
})
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.green]: props.color === 'green',
      [$style.orange]: props.color === 'orange',
      [$style.gray]: props.color === 'gray',
      [$style.blue]: props.color === 'blue',
      [$style.boxed]: props.variant === 'boxed',
    }]"
  >
    <UiTypography
      :class="$style.value"
      variant="badge"
      as="span"
    >
      <slot />
    </UiTypography>
  </div>
</template>

<style module lang="scss">
.wrapper {
  padding: 2px 8px;
  border-radius: 24px;
  width: fit-content;
  height: fit-content;

  &.green {
    background-color: var(--c-green-15);

    .value {
      color: var(--c-green);
    }
  }

  &.orange {
    background-color: var(--c-orange-15);

    .value {
      color: var(--c-orange);
    }
  }

  &.gray {
    background-color: var(--c-white-06);

    .value {
      color: var(--c-white-75);
    }
  }

  &.blue {
    background-color: var(--c-label-link-20);

    .value {
      color: var(--c-label-link);
    }
  }

  &.boxed {
    border-radius: var(--s-border-radius-small);
  }
}
</style>
