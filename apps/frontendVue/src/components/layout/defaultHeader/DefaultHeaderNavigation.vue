<script setup lang="ts">
import UiTypography from "~/components/ui/UiTypography.vue";
import { NuxtLink } from "#components";
import { useLocalePath } from "#i18n";
import { navigationLinks } from "~/components/layout/defaultHeader/navigationLinks";
import SignInModal from "~/features/signIn/ui/SignInModal.vue";
import { useUserProfile } from "~/composables/useAuthApi";
import { UserProfileDropdown, UserProfileDropdownSkeleton } from "~/features/profile";

const localePath = useLocalePath();

const { data: profile, isLoading: isLoadingProfile } = useUserProfile();

</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      v-for="link in navigationLinks"
      :key="link.path"
      :to="localePath(link.path)"
      :as="NuxtLink"
      variant="link"
      :activeClass="$style.active"
    >
      {{ $t(link.title) }}
    </UiTypography>
    <UserProfileDropdownSkeleton v-if="isLoadingProfile" />
    <SignInModal v-if="!profile && !isLoadingProfile" />
    <UserProfileDropdown v-else />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  gap: 20px;
}

.active {
  color: var(--c-highlight);
}
</style>
