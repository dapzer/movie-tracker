<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { UiMarkdown } from "~/shared/ui/UiMarkdown"

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
  <UiMarkdown :value="$t('legals.termsOfUse')" />
</template>
