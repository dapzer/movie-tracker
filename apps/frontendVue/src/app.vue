<script lang="ts" setup>
import { useI18n, useSeoMeta } from "#imports";

const { t } = useI18n();

useSeoMeta({
  titleTemplate(titleChunk) {
    return titleChunk || "Title not defined";
  },
  ogTitle() {
    return t("seo.title");
  },
  description() {
    return t("seo.description");
  },
  ogDescription() {
    return t("seo.description");
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
