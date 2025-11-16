<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { LegalsTabs } from "~/widgets/legals"

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("ui.termsOfUse")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("ui.termsOfUse")}`
  },
})
</script>

<template>
  <LegalsTabs tab="termsOfUse" />
</template>
