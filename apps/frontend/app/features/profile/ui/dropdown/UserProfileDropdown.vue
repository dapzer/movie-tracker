=
<script lang="ts" setup>
import UserProfileDropdownContent from "~/features/profile/ui/dropdown/UserProfileDropdownContent.vue"
import UserProfileDropdownTrigger from "~/features/profile/ui/dropdown/UserProfileDropdownTrigger.vue"
import { useAuth } from "~/shared/composables/useAuth"
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
