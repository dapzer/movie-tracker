<script lang="ts" setup>
import { useI18n, useSeoMeta } from "#imports"
import { MediaReviewsModeration } from "~/widgets/moderation"

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("dashboard.tabs.reviewsModeration")} | ${t("dashboard.title")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("dashboard.tabs.reviewsModeration")} | ${t("dashboard.title")}`
  },
})
</script>

<template>
  <MediaReviewsModeration />
</template>
