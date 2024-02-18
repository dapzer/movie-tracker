<script lang="ts" setup>

import UiButton from "~/components/ui/UiButton.vue";
import { useInitializeSitemapGenerationsApi } from "~/composables/useSitemapsApi";
import { toast } from "vue3-toastify";
import { useI18n } from "#imports";

const initializeSitemapGenerationsApi = useInitializeSitemapGenerationsApi();
const { t } = useI18n();

const generateSitemap = async () => {
  toast.success(t("dashboard.sitemapGenerationStarted"));

  initializeSitemapGenerationsApi.mutateAsync().then(() => {
    toast.success(t("dashboard.sitemapGenerationFinished"));
  });
};
</script>

<template>
  <div :class="$style.wrapper">
    <UiButton @click="generateSitemap">
      {{ $t("dashboard.generateSitemap") }}
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
