<script setup lang="ts">

import { UiButton } from "~/components/ui/UiButton"
import { BurgerMenuIcon, CrossIcon } from "~/components/ui/icons"
import { AppLogo } from "~/shared/ui/appLogo"
import { SearchCombobox } from "~/features/search"

const isMobileMenuOpen = defineModel("isMobileMenuOpen", { required: true })
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      :class="$style.trigger"
      scheme="default"
      variant="textIcon"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    >
      <BurgerMenuIcon v-if="!isMobileMenuOpen" />
      <CrossIcon v-else />
    </UiButton>
    <AppLogo />
    <SearchCombobox :class="$style.search" />
  </div>
</template>

<style module lang="scss">
@import "~/styles/variables";
@import "~/styles/mixins";

.wrapper {
  display: flex;
  align-items: center;
  width: 100%;
  gap: 8px;

  .search {
    margin-right: 110px;
    margin-left: 110px;

    @include tabletDevice() {
      margin-right: 28px;
      margin-left: 28px;
    }

    @include mobilePlusDevice() {
      display: none;
    }
  }

  .trigger {
    display: none;
    width: 32px;
    height: 32px;

    svg {
      width: 16px;
    }

    @include mobilePlusDevice() {
      display: flex;
    }
  }
}
</style>
