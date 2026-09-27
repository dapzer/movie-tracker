<script setup lang="ts">
import { useI18n, useSeoMeta } from "#imports"
import { DataImportProcessing } from "~/features/dataImport"
import { useProtectedRoute } from "~/shared/composables/useProtectedRoute"

useProtectedRoute()

const { t } = useI18n()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("dataImport.processing.pageTitle")} | ${titleChunk} `
  },
  ogTitle() {
    return `%s | ${t("dataImport.processing.pageTitle")}`
  },
})
</script>

<template>
  <DataImportProcessing />
</template>
