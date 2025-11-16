<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      as="h1"
      variant="title2"
    >
      {{ $t("brand.title") }}
    </UiTypography>
    <UiTypography>
      {{ $t("brand.description") }}
    </UiTypography>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
