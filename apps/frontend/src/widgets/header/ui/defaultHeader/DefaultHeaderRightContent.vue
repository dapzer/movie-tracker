<script setup lang="ts">

import { LanguageSelectorDropdown } from "~/features/languegeSelector"
import DefaultHeaderListsNavigation from "~/widgets/header/ui/defaultHeader/DefaultHeaderListsNavigation.vue"
import { UiButton } from "~/components/newUi/UiButton"
import { useLocalePath } from "#i18n"
import { useAuth } from "#imports"
import { UserProfileDropdown } from "~/features/profile"

const { profile } = useAuth();
const localePath = useLocalePath();
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
    <NuxtLink
      v-if="!profile"
      :to="localePath('/sign-in')"
    >
      <UiButton>
        {{ $t('auth.signIn') }}
      </UiButton>
    </NuxtLink>
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
