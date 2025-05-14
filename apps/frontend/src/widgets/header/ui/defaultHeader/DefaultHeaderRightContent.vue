<script setup lang="ts">
import { SignInLink } from "~/features/auth"
import { LanguageSelectorDropdown } from "~/features/languegeSelector"
import { UserProfileDropdown } from "~/features/profile"
import { useAuth } from "~/shared/composables/useAuth"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import DefaultHeaderListsNavigation from "~/widgets/header/ui/defaultHeader/DefaultHeaderListsNavigation.vue"

interface DefaultHeaderRightContentEmits {
  (event: "handleOpenSearchModal"): void
}

const emits = defineEmits<DefaultHeaderRightContentEmits>()

const { profile } = useAuth()
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
      <UiIcon
        name="icon:search"
        :size="24"
      />
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
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

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
