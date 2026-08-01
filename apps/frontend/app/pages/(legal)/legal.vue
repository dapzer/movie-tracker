<script setup lang="ts">
import type { LegalsTab } from "~/widgets/legals/ui/LegalsTabs.vue"
import { useRouteBaseName } from "#i18n"
import { useRoute } from "#imports"
import { computed } from "vue"
import LegalsTabs from "~/widgets/legals/ui/LegalsTabs.vue"

const legalRouteTabMap: Record<string, LegalsTab> = {
  "legal-terms-of-use": "termsOfUse",
  "legal-privacy-policy": "privacyPolicy",
  "legal-community-policy": "communityPolicy",
}

const routeBaseName = useRouteBaseName()
const route = useRoute()

const activeTab = computed<LegalsTab>(() => {
  const name = routeBaseName(route) as string
  return legalRouteTabMap[name] ?? "termsOfUse"
})
</script>

<template>
  <LegalsTabs :tab="activeTab">
    <NuxtPage />
  </LegalsTabs>
</template>
