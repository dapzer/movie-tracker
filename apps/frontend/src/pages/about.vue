<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { AboutHero, AboutService } from "~/widgets/about"

const { t } = useI18n();

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t('navigation.about')} | ${titleChunk}`;
  },
  ogTitle() {
    return `%s | ${t('navigation.about')}`;
  },
})
</script>

<template>
  <AboutHero />
  <AboutService />
</template>

<style scoped lang="scss">

</style>
