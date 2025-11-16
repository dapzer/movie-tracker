<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { AboutFaq, AboutFeatures, AboutHero, AboutService, AboutTeam } from "~/widgets/about"

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("navigation.about")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("navigation.about")}`
  },
})
</script>

<template>
  <AboutHero />
  <AboutService />
  <AboutFeatures />
  <AboutFaq />
  <AboutTeam />
</template>

<style scoped lang="scss">

</style>
