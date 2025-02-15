<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

export type TagColor = 'gray' | 'green' | 'orange'

interface UiTagProps {
  color?: TagColor
}

const props = withDefaults(defineProps<UiTagProps>(), {
  color: 'gray',
})
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.green]: props.color === 'green',
      [$style.orange]: props.color === 'orange',
      [$style.gray]: props.color === 'gray',
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
}
</style>
