<script lang="ts" setup>
import { useI18n, useSeoMeta } from "#imports"
import { UsersList } from "~/features/users"

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("dashboard.tabs.usersManagement")} | ${t("dashboard.title")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("dashboard.tabs.usersManagement")} | ${t("dashboard.title")}`
  },
})
</script>

<template>
  <UsersList />
</template>
