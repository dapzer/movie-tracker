<script setup lang="ts">

import { UiTypography } from "~/components/newUi/UiTypography"
import { LanguageSelector } from "~/features/languegeSelector"
import { PublicResources } from "~/shared/ui/publicResources"
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.body">
      <LanguageSelector />
      <PublicResources />
    </div>
    <UiTypography variant="description">
      {{ $t('footer.copyright') }}
    </UiTypography>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .body {
    display: flex;
    justify-content: space-between;
    align-items: center;
    gap: 16px;
    flex-wrap: wrap;
  }
}
</style>
