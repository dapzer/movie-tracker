=
<script lang="ts" setup>
import { useAuth } from "~/composables/useAuth"
import UserProfileDropdownContent from "~/features/profile/ui/UserProfileDropdownContent.vue"
import UserProfileDropdownTrigger from "~/features/profile/ui/UserProfileDropdownTrigger.vue"
import { UiDropdown } from "~/shared/ui/UiDropdown"

const { profile } = useAuth()
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
