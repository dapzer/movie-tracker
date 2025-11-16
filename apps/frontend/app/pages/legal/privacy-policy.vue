<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { LegalsTabs } from "~/widgets/legals"

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("ui.privacyPolicy")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("ui.privacyPolicy")}`
  },
})
</script>

<template>
  <LegalsTabs tab="privacyPolicy" />
</template>
