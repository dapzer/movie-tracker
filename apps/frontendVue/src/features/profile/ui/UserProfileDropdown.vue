<script setup lang="ts">

import UiDropdown from "~/components/ui/UiDropdown.vue";
import UserProfileDropdownTrigger from "~/features/profile/ui/UserProfileDropdownTrigger.vue";
import { useUserProfile } from "~/composables/useAuthApi";
import UserProfileDropdownContent from "~/features/profile/ui/UserProfileDropdownContent.vue";

const { data: profile, isLoading } = useUserProfile();
</script>

<template>
  <UiDropdown
    v-if="profile"
    :class="$style.content"
  >
    <template #trigger>
      <UserProfileDropdownTrigger :profile="profile" />
    </template>

    <template #content>
      <UserProfileDropdownContent :profile="profile" />
    </template>
  </UiDropdown>
</template>

<style module lang="scss">
.content {
  margin-top: 20px;
}
</style>
