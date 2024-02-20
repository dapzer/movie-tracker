<script lang="ts" setup>
import { useAuth, useGetMediaItemsApi, useGetMediaListsApi, useHead, useI18n, useSeoMeta, watch } from "#imports";
import { MediaItemQueryKeys, MediaListQueryKeys } from "~/constants/queryKeys";
import { useQueryClient } from "@tanstack/vue-query";

const queryClient = useQueryClient();
const { t, locale } = useI18n();

useGetMediaListsApi();
useGetMediaItemsApi();
const { isProfileSuccess } = useAuth();

watch(isProfileSuccess, () => {
  if (isProfileSuccess) {
    queryClient.refetchQueries({ queryKey: [MediaListQueryKeys.GET_ALL] });
    queryClient.refetchQueries({ queryKey: [MediaItemQueryKeys.GET_ALL] });
  }
});

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
