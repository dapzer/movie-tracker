<script setup lang="ts">
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { SearchCombobox } from "~/features/search"
import { AppLogo } from "~/shared/ui/appLogo"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

const isMobileMenuOpen = defineModel("isMobileMenuOpen", { required: true })
const localePath = useLocalePath()
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.logo">
      <UiButton
        :class="$style.trigger"
        scheme="default"
        variant="textIcon"
        @click="isMobileMenuOpen = !isMobileMenuOpen"
      >
        <UiIcon
          v-if="!isMobileMenuOpen"
          name="icon:burger-menu"
          :size="16"
        />
        <UiIcon
          v-else
          :size="16"
          name="icon:cross"
        />
      </UiButton>
      <AppLogo />
    </div>
    <UiTypography
      :class="$style.about"
      :as="NuxtLink"
      variant="label"
      :to="localePath('/about')"
      schema="link"
    >
      {{ $t("navigation.about") }}
    </UiTypography>
    <SearchCombobox :class="$style.search" />
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/variables";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 38px;

  .logo {
    display: flex;
    align-items: center;
    gap: 8px;
  }

  .search {
    max-width: 464px;

    @include tabletDevice() {
      max-width: 252px;
    }

    @include mobilePlusDevice() {
      display: none;
    }
  }

  .trigger {
    display: none;
    width: 32px;
    height: 32px;

    @include mobilePlusDevice() {
      display: flex;
    }
  }

  .about {
    white-space: nowrap;

    &:not(:hover, :focus, :active) {
      color: var(--c-white-75);
    }

    @include mobilePlusDevice() {
      display: none;
    }
  }
}
</style>
