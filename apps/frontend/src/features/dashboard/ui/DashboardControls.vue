<script lang="ts" setup>

import UiButton from "~/components/ui/UiButton.vue";
import { toast } from "vue3-toastify";
import { useI18n } from "#imports";
import UiContentCard from "~/components/ui/UiContentCard.vue";
import { useInitializeSitemapGenerationsApi } from "~/api/sitemaps/useSitemapsApi";
import { useInitializeDetailsGenerationApi } from "~/api/details/useDetailsApi";

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
  <UiContentCard :title="$t('dashboard.dataGeneration')">
    <UiButton @click="generateSitemap">
      {{ $t("dashboard.generateSitemap") }}
    </UiButton>
    <UiButton @click="generateDetails">
      {{ $t("dashboard.generateDetails") }}
    </UiButton>
  </UiContentCard>
</template>

<style lang="scss" module>

</style>
