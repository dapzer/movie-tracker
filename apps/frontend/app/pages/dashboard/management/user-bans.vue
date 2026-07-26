<script lang="ts" setup>
import { useI18n, useSeoMeta } from "#imports"
import { UserRoleEnum } from "@movie-tracker/types"
import { DashboardTabs } from "~/features/dashboard"
import { UserBansList } from "~/features/userBans"
import { useProtectedRoute } from "~/shared/composables/useProtectedRoute"
import { UiContainer } from "~/shared/ui/UiContainer"

useProtectedRoute([UserRoleEnum.ADMIN])

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("dashboard.tabs.userBansManagement")} | ${t("dashboard.title")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("dashboard.tabs.userBansManagement")} | ${t("dashboard.title")}`
  },
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <DashboardTabs tab="userBansManagement">
      <UserBansList />
    </DashboardTabs>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  margin-top: 60px !important;
}
</style>
