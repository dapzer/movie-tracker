<script lang="ts" setup>
import { useHead, useI18n, useSeoMeta } from "#imports";

const { t, locale } = useI18n();

useHead({
  htmlAttrs: {
    lang() {
      return locale.value;
    },
  }
})

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
  },
  applicationName: "Movie Tracker",
  ogSiteName: "Movie Tracker",
  keywords() {
    return t("seo.keywords");
  }
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
