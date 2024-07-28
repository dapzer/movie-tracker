<script setup lang="ts">

import { UiButton } from "~/components/newUi/UiButton"
import { BurgerMenuIcon, CrossIcon } from "~/components/ui/icons"
import { AppLogo } from "~/shared/ui/appLogo"

const isMobileMenuOpen = defineModel("isMobileMenuOpen", { required: true })
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton
      :class="$style.trigger"
      scheme="default"
      variant="text"
      @click="isMobileMenuOpen = !isMobileMenuOpen"
    >
      <BurgerMenuIcon v-if="!isMobileMenuOpen" />
      <CrossIcon v-else />
    </UiButton>
    <AppLogo />
  </div>
</template>

<style module lang="scss">
@import "~/styles/newVariables";
@import "~/styles/mixins";

.wrapper {
  display: flex;
  gap: 8px;
  align-items: center;


  .trigger {
    display: none;
    align-items: center;
    justify-content: center;
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
