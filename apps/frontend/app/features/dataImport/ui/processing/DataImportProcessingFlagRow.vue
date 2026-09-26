<script setup lang="ts">
import DataImportProcessingToggleCard from "~/features/dataImport/ui/processing/DataImportProcessingToggleCard.vue"

interface DataImportProcessingFlagRowProps {
  title: string
  foundCount: number
  failedCount?: number
  disabled?: boolean
}

const props = defineProps<DataImportProcessingFlagRowProps>()

const enabled = defineModel<boolean>("enabled", { default: false })
</script>

<template>
  <DataImportProcessingToggleCard
    v-model:enabled="enabled"
    :title="props.title"
    :found-count="props.foundCount"
    :failed-count="props.failedCount"
    :disabled="props.disabled"
  />
</template>
