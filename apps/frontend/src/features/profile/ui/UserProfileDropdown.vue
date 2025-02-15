=
<script lang="ts" setup>

import { UiDropdown } from "../../../shared/ui/UiDropdown";
import UserProfileDropdownTrigger from "~/features/profile/ui/UserProfileDropdownTrigger.vue";
import UserProfileDropdownContent from "~/features/profile/ui/UserProfileDropdownContent.vue";
import { useAuth } from "~/composables/useAuth";

const { profile } = useAuth();
</script>

<template>
  <UiDropdown
    v-if="profile"
    align="end"
    :indent="32"
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
</style>
