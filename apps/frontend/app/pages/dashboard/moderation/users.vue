<script lang="ts" setup>
import { UserRoleEnum } from "@movie-tracker/types"
import { DashboardTabs } from "~/features/dashboard"
import { UsersList } from "~/features/users"
import { useProtectedRoute } from "~/shared/composables/useProtectedRoute"
import { UiContainer } from "~/shared/ui/UiContainer"

useProtectedRoute([UserRoleEnum.ADMIN])
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <DashboardTabs tab="usersModeration">
      <UsersList />
    </DashboardTabs>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin-top: 60px !important;
}
</style>
