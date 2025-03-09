<script lang="ts" setup>
import { useI18n } from "#imports"
import { toast } from "vue3-toastify"
import { useInitializeDetailsGenerationApi } from "~/api/details/useDetailsApi"
import { useInitializeSitemapGenerationsApi } from "~/api/sitemaps/useSitemapsApi"
import DasboardCard from "~/features/dashboard/ui/DasboardCard.vue"
import { UiButton } from "~/shared/ui/UiButton"

const initializeSitemapGenerationsApi = useInitializeSitemapGenerationsApi()
const initializeDetailsGenerationApi = useInitializeDetailsGenerationApi()

const { t } = useI18n()

async function generateSitemap() {
  toast.success(t("dashboard.sitemapGenerationStarted"))

  initializeSitemapGenerationsApi.mutateAsync().then(() => {
    toast.success(t("dashboard.sitemapGenerationFinished"))
  })
}

async function generateDetails() {
  toast.success(t("dashboard.detailsGenerationStarted"))

  initializeDetailsGenerationApi.mutateAsync().then(() => {
    toast.success(t("dashboard.detailsGenerationFinished"))
  })
}
</script>

<template>
  <DasboardCard
    :class="$style.wrapper"
    :title="$t('dashboard.dataGeneration')"
  >
    <UiButton @click="generateSitemap">
      {{ $t("dashboard.generateSitemap") }}
    </UiButton>
    <UiButton @click="generateDetails">
      {{ $t("dashboard.generateDetails") }}
    </UiButton>
  </DasboardCard>
</template>

<style lang="scss" module>
.wrapper {
  button {
    width: 100%;
  }
}
</style>
