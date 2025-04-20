<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiLimitProps {
  limit: number
  current: number
}

const props = withDefaults(defineProps<UiLimitProps>(), {
  current: 0,
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      as="span"
      variant="badge"
    >
      {{ props.current }}
    </UiTypography>
    <UiTypography
      :class="$style.limit"
      as="span"
      variant="badge"
    >
      /{{ props.limit }}
    </UiTypography>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  width: fit-content;
  background-color: var(--c-white-05);
  padding: 2px 6px;
  border-radius: 99px;
}

.limit {
  color: var(--c-white-50);
}
</style>
