<script setup lang="ts">
export type DataImportCardSize = "small" | "medium"

interface DataImportCardProps {
  size?: DataImportCardSize
}

const props = withDefaults(defineProps<DataImportCardProps>(), {
  size: "medium",
})
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.small]: props.size === 'small',
      [$style.medium]: props.size === 'medium',
    }]"
  >
    <slot />
  </div>
</template>

<style module lang="scss">
.wrapper {
  background-color: var(--c-card-background-hovered);
  border: 1px solid var(--c-stroke);
  border-radius: var(--s-border-radius);

  &.small {
    padding: 12px;
  }

  &.medium {
    padding: 16px;
  }
}
</style>
