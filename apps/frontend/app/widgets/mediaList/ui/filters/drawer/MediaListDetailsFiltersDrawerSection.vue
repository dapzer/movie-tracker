<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaListDetailsFiltersDrawerSectionProps {
  title: string
}

const props = defineProps<MediaListDetailsFiltersDrawerSectionProps>()
</script>

<template>
  <div>
    <UiTypography
      :class="$style.title"
      variant="labelSmall"
    >
      {{ props.title }}
    </UiTypography>

    <slot />
  </div>
</template>

<style module lang="scss">
.title {
  margin-bottom: 10px;
  font-weight: var(--fw-semi-bold);
}
</style>
