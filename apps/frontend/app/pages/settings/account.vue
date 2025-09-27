<script setup lang="ts">
import { definePageMeta, useI18n, useSeoMeta } from "#imports"
import { AccountSettings } from "~/features/accountSettings"

const { t } = useI18n()

definePageMeta({
  middleware: ["auth"],
})

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
