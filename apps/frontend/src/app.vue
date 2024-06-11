<script lang="ts" setup>
import { useHead, useI18n, useSeoMeta } from "#imports";
import { useLocaleHead } from "#i18n";

const { t } = useI18n();

const i18nHead = useLocaleHead({
  addDirAttribute: true,
  addSeoAttributes: true
});

console.log(i18nHead.value.link);

useHead({
  htmlAttrs: {
    lang: () => i18nHead.value.htmlAttrs?.lang,
    dir: () => i18nHead.value.htmlAttrs?.dir
  },
  link: [...(i18nHead.value.link.filter((el: { hid: string, href: string, rel: string }) => el.rel !== "canonical")
    || [])],
  meta: [...(i18nHead.value.meta || [])]
});

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
  ogType: "website",
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
