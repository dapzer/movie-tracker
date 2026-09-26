<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"

interface DataImportProcessingFieldProps {
  label: string
}

const props = defineProps<DataImportProcessingFieldProps>()
</script>

<template>
  <label :class="$style.field">
    <UiTypography
      as="span"
      variant="cardTitle"
    >
      {{ props.label }}
    </UiTypography>

    <slot />
  </label>
</template>

<style module lang="scss">
.field {
  display: flex;
  flex-direction: column;
  gap: 8px;

  & > span {
    color: var(--c-description);
  }
}
</style>
