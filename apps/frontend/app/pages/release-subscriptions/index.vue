<script setup lang="ts">
import { definePageMeta, useI18n, useSeoMeta } from "#imports"
import { ReleaseSubscriptions } from "~/features/releaseSubscriptions"

const { t } = useI18n()

definePageMeta({
  middleware: ["auth"],
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("releaseSubscription.pageTitle")} | ${titleChunk} `
  },
  ogTitle() {
    return `%s | ${t("releaseSubscription.pageTitle")}`
  },
})
</script>

<template>
  <ReleaseSubscriptions :class="$style.wrapper" />
</template>

<style module lang="scss">
.wrapper {
  margin-top: 60px !important;
}
</style>
