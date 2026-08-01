<script setup lang="ts">
import type { LegalsTab } from "~/widgets/legals/ui/LegalsTabs.vue"
import { useRouteBaseName } from "#i18n"
import { useRoute } from "#imports"
import { computed, ref, watch } from "vue"
import LegalsTabs from "~/widgets/legals/ui/LegalsTabs.vue"

const legalRouteTabMap: Record<string, LegalsTab> = {
  "legal-terms-of-use": "termsOfUse",
  "legal-privacy-policy": "privacyPolicy",
  "legal-community-policy": "communityPolicy",
}

const routeBaseName = useRouteBaseName()
const route = useRoute()

const currentTabName = computed(() => {
  return legalRouteTabMap[routeBaseName(route) as string]
})

const activeTab = ref<LegalsTab>(currentTabName.value ?? "termsOfUse")

watch(currentTabName, (tab) => {
  if (tab) {
    activeTab.value = tab
  }
})
</script>

<template>
  <LegalsTabs :tab="activeTab">
    <NuxtPage />
  </LegalsTabs>
</template>
