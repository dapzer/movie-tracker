<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

interface DataImportSectionProps {
  label: string
}

defineProps<DataImportSectionProps>()
</script>

<template>
  <section :class="$style.wrapper">
    <UiTypography
      as="span"
      variant="label"
    >
      {{ label }}
    </UiTypography>

    <slot />
  </section>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
