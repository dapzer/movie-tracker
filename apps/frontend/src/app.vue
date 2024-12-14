<script lang="ts" setup>
import { useAuth, useHead, useI18n, useSeoMeta } from "#imports";
import { useLocaleHead } from "#i18n";
import { ConfigProvider } from "radix-vue"
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi"
import { useGetMediaItemsApi } from "~/api/mediaItem/useMediaItemtApi"
import { useId } from "#app"

const { t } = useI18n();

const i18nHead = useLocaleHead({
  dir: true,
  seo: true,
  lang: true
});

const useIdFunction = () => useId()!
const { suspenseProfile } = useAuth()
const getMediaListsApi = useGetMediaListsApi()
const getMediaItemsApi = useGetMediaItemsApi()


await Promise.all([
  suspenseProfile(),
  getMediaItemsApi.suspense(),
  getMediaListsApi.suspense()
])

useHead({
  htmlAttrs: {
    lang: () =>  i18nHead.value.htmlAttrs!.lang,
    dir: () => i18nHead.value.htmlAttrs?.dir
  },
  link: [...(i18nHead.value.link || [])],
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
  <ConfigProvider :use-id="useIdFunction">
    <NuxtLoadingIndicator
      :class="$style.progressBar"
      color="#78B6FF"
      :throttle="10"
      :height="1"
    />
    <NuxtLayout>
      <NuxtPage />
    </NuxtLayout>
  </ConfigProvider>
</template>

<style module lang="scss">
.progressBar {
  top: var(--s-header-height) !important;
}
</style>
