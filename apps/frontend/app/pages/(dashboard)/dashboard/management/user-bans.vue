<script lang="ts" setup>
import { useI18n, useSeoMeta } from "#imports"
import { UserBansList } from "~/features/userBans"

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
  <UserBansList />
</template>
