<script lang="ts" setup>

import UiButton from "~/components/ui/UiButton.vue";
import { useInitializeSitemapGenerationsApi } from "~/composables/useSitemapsApi";
import { toast } from "vue3-toastify";
import { useI18n } from "#imports";
import { useInitializeDetailsGenerationApi } from "~/composables/useDetails";

const initializeSitemapGenerationsApi = useInitializeSitemapGenerationsApi();
const initializeDetailsGenerationApi = useInitializeDetailsGenerationApi()

const { t } = useI18n();

const generateSitemap = async () => {
  toast.success(t("dashboard.sitemapGenerationStarted"));

  initializeSitemapGenerationsApi.mutateAsync().then(() => {
    toast.success(t("dashboard.sitemapGenerationFinished"))
  });
};

const generateDetails = async () => {
  toast.success(t("dashboard.detailsGenerationStarted"));

  initializeDetailsGenerationApi.mutateAsync().then(() => {
    toast.success(t("dashboard.detailsGenerationFinished"));
  })
}
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton @click="generateSitemap">
      {{ $t("dashboard.generateSitemap") }}
    </UiButton>
    <UiButton @click="generateDetails">
      {{ $t("dashboard.generateDetails") }}
    </UiButton>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  gap: 20px;
  flex-wrap: wrap;
  margin-top: 20px;
}
</style>
