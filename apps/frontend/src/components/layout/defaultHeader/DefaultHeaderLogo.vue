<script lang="ts" setup>

import { NuxtLink } from "#components";
import { LanguageSelector } from "~/features/languegeSelector";
import { useLocalePath } from "#i18n";
import UiTypography from "~/components/ui/UiTypography.vue";

interface DefaultHeaderLogoProps {
  isMobileMenuOpen: boolean;
}

const props = defineProps<DefaultHeaderLogoProps>();
const localePath = useLocalePath();
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      v-if="!props.isMobileMenuOpen"
      :as="NuxtLink"
      :class="$style.logo"
      :to="localePath('/')"
      variant="title3"
    >
      Movie Tracker
    </UiTypography>
    <LanguageSelector
      :class="{
        [$style.localeHider]: !props.isMobileMenuOpen
      }"
    />
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

  @media screen and (max-width: $bp-md) {
    .localeHider {
      display: none;
    }
  }
}
</style>
