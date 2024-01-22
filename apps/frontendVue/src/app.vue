<script lang="ts" setup>
import { useI18n, useSeoMeta } from "#imports";

const { t } = useI18n();

useSeoMeta({
  titleTemplate: (titleChunk) => {
    return titleChunk ?? "Title not defined";
  },
  ogTitle: () => t("seo.title"),
  description: () => t("seo.description"),
  ogDescription: () => t("seo.description")
});
</script>

<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>
</template>
