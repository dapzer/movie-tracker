<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

export type UiStatCardVariant = "default" | "danger"

interface UiStatCardProps {
  label: string
  value: string | number
  variant?: UiStatCardVariant
}

const props = withDefaults(defineProps<UiStatCardProps>(), {
  variant: "default",
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      :class="[$style.title, {
        [$style.danger]: props.variant === 'danger',
      }]"
      variant="description"
    >
      {{ props.label }}
    </UiTypography>
    <UiTypography
      as="span"
      variant="title3"
      :class="[$style.value, {
        [$style.danger]: props.variant === 'danger',
      }]"
    >
      {{ props.value }}
    </UiTypography>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 16px 20px;
  background-color: var(--c-card-background-hovered);
  border-radius: var(--s-border-radius);
}

.title {
  color: var(--c-white-60);
}

.danger {
  &.title {
    color: var(--c-error-3-80);
  }

  &.value {
    color: var(--c-error-3);
  }
}
</style>
