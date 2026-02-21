<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { AccountSettings } from "~/features/accountSettings"
import { useProtectedRoute } from "~/shared/composables/useProtectedRoute"

useProtectedRoute()

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("accountSettings.pageTitle")} | ${titleChunk} `
  },
  ogTitle() {
    return `%s | ${t("accountSettings.pageTitle")}`
  },
})
</script>

<template>
  <AccountSettings />
</template>
