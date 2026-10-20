<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

interface MediaCardManagementMenuItemProps {
  title: string
}

const props = defineProps<MediaCardManagementMenuItemProps>()
</script>

<template>
  <div>
    <UiTypography
      :class="$style.title"
      variant="cardTitle"
    >
      {{ props.title }}
    </UiTypography>
    <slot />
  </div>
</template>

<style module lang="scss">
.title {
  margin-bottom: 6px;
  color: var(--c-description);
}
</style>
