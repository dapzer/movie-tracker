<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { DataImport } from "~/features/dataImport"
import { useProtectedRoute } from "~/shared/composables/useProtectedRoute"

useProtectedRoute()

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("dataImport.pageTitle")} | ${titleChunk} `
  },
  ogTitle() {
    return `%s | ${t("dataImport.pageTitle")}`
  },
})
</script>

<template>
  <DataImport />
</template>
