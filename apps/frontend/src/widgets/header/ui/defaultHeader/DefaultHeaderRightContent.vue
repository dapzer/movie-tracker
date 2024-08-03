<script setup lang="ts">

import { LanguageSelectorDropdown } from "~/features/languegeSelector"
import DefaultHeaderListsNavigation from "~/widgets/header/ui/defaultHeader/DefaultHeaderListsNavigation.vue"
import { UiButton } from "~/components/newUi/UiButton"
import { useAuth } from "#imports"
import { UserProfileDropdown } from "~/features/profile"
import { SignInLink } from "~/features/auth"

const { profile } = useAuth();
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.menu">
      <DefaultHeaderListsNavigation />
    </div>
    <div :class="$style.menu">
      <LanguageSelectorDropdown />
    </div>
    <!--    <SignInModal />-->
    <SignInLink v-if="!profile">
      <UiButton>
        {{ $t('auth.signIn') }}
      </UiButton>
    </SignInLink>
    <UserProfileDropdown v-else />
  </div>
</template>

<style module lang="scss">
@import "~/styles/newVariables";
@import "~/styles/mixins";

.wrapper {
  display: flex;
  align-items: center;
  gap: 16px;

  .menu {
    display: flex;
  }

  @include mobilePlusDevice() {
    .menu {
      display: none;
    }
  }
}
</style>
