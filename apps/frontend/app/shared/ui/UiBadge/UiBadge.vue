<script setup lang="ts">
export type UiBadgeSize = "small" | "medium"
export type UiBadgeColor = "primary" | "tertiary" | "gray" | "orange"

interface UiBadgeProps {
  size?: UiBadgeSize
  color?: UiBadgeColor
}

const props = withDefaults(defineProps<UiBadgeProps>(), {
  size: "medium",
  color: "primary",
})
</script>

<template>
  <span
    :class="[$style.body, {
      [$style.small]: props.size === 'small',
      [$style.medium]: props.size === 'medium',
      [$style.primary]: props.color === 'primary',
      [$style.tertiary]: props.color === 'tertiary',
      [$style.gray]: props.color === 'gray',
      [$style.orange]: props.color === 'orange',
    }]"
  >
    <slot />
  </span>
</template>

<style module lang="scss">
.body {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  color: var(--c-text);
  font-weight: var(--fw-semi-bold);
  font-size: var(--fs-badge);
  line-height: var(--lh-badge);
  border-radius: 99px;
  padding: 0 6px;
}

.small {
  width: fit-content;
  min-width: 16px;
  height: 16px;
  min-height: 16px;
}

.medium {
  width: fit-content;
  min-width: 20px;
  height: 20px;
  min-height: 20px;
}

.primary {
  background-color: var(--c-button-background-primary);
}

.tertiary {
  background-color: var(--c-badge-tertiary);
}

.gray {
  background-color: var(--c-white-06);
  color: var(--c-white-75);
}

.orange {
  background-color: var(--c-orange-15);
  color: var(--c-orange);
}
</style>
