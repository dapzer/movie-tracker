<script setup lang="ts">
import { UiTypography } from "~/components/newUi/UiTypography"

export type TagColor = 'green' | 'orange'

interface UiTagProps {
  color: TagColor
}

const props = withDefaults(defineProps<UiTagProps>(), {
  color: 'orange',
})
</script>

<template>
  <div
    :class="[$style.wrapper, {
      [$style.green]: props.color === 'green',
      [$style.orange]: props.color === 'orange',
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
}
</style>
