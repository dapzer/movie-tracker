<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { LegalsTabs } from "~/widgets/legals"

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("ui.communityPolicy")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("ui.communityPolicy")}`
  },
})
</script>

<template>
  <LegalsTabs tab="communityPolicy" />
</template>
