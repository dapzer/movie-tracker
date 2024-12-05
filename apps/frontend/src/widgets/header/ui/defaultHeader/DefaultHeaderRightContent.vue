<script setup lang="ts">

import { LanguageSelectorDropdown } from "~/features/languegeSelector"
import DefaultHeaderListsNavigation from "~/widgets/header/ui/defaultHeader/DefaultHeaderListsNavigation.vue"
import { UiButton } from "~/components/newUi/UiButton"
import { useAuth } from "#imports"
import { UserProfileDropdown } from "~/features/profile"
import { SignInLink } from "~/features/auth"
import { SearchIcon } from "~/components/ui/icons"

interface DefaultHeaderRightContentEmits {
  (event: "handleOpenSearchModal"): void
}

const emits = defineEmits<DefaultHeaderRightContentEmits>()

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
    <UiButton
      :class="$style.searchButton"
      variant="textIcon"
      @click="emits('handleOpenSearchModal')"
    >
      <SearchIcon width="24" />
    </UiButton>
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
  width: 100%;
  max-width: max-content;

  .menu {
    display: flex;

    @include mobilePlusDevice() {
      display: none;
    }
  }

  .searchButton {
    display: none;

    @include mobilePlusDevice() {
      display: flex;
      height: 32px;
      width: 32px;
    }
  }
}
</style>
