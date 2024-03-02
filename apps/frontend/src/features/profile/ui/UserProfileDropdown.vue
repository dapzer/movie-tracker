<script lang="ts" setup>

import UiDropdown from "~/components/ui/UiDropdown.vue";
import UserProfileDropdownTrigger from "~/features/profile/ui/UserProfileDropdownTrigger.vue";
import UserProfileDropdownContent from "~/features/profile/ui/UserProfileDropdownContent.vue";
import { useAuth } from "~/composables/useAuth";

const { profile } = useAuth();
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

<style lang="scss" module>
.content {
  margin-top: 24px !important;
}
</style>
