<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { UiContainer } from "~/shared/ui/UiContainer"
import { BrandInformation, BrandLogos } from "~/widgets/about"

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("brand.pageTitle")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("brand.pageTitle")}`
  },
})
</script>

<template>
  <UiContainer
    as="section"
    :class="$style.wrapper"
  >
    <BrandInformation />
    <BrandLogos />
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  padding-top: 70px;
  max-width: 768px;
  display: flex;
  flex-direction: column;
  gap: 32px;
}
</style>
