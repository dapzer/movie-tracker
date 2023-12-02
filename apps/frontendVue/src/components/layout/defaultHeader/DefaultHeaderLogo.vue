<script lang="ts" setup>

import { NuxtLink } from "#components";
import { LanguageSelector } from "~/features/languegeSelector";
import { useLocalePath } from "#i18n";
import UiTypography from "~/components/ui/UiTypography.vue";

const localePath = useLocalePath();
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      :class="$style.logo"
      :as="NuxtLink"
      :to="localePath('/')"
      variant="title3"
    >
      Movie Tracker
    </UiTypography>
    <LanguageSelector />
  </div>
</template>

<style lang="scss" module>
@import "~/styles/variables";

.wrapper {
  display: flex;
  align-items: center;
  gap: 20px;

  .logo {
    font-size: var(--fs-logo);

    @media screen and (max-width: $bp-md) {
      font-size: var(--fs-m-logo);
    }
  }
}
</style>
