<script setup lang="ts">
import type { DataImportSourceEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import DataImportCard from "~/features/dataImport/ui/DataImportCard.vue"
import DataImportExportGuideSteps from "~/features/dataImport/ui/uploadForm/DataImportExportGuideSteps.vue"
import { UiAccordion } from "~/shared/ui/UiAccordion"

interface DataImportExportGuideProps {
  source: DataImportSourceEnum
}

const props = defineProps<DataImportExportGuideProps>()

const { t } = useI18n()

const items = computed(() => [
  {
    value: "export-guide",
    title: t("dataImport.guide.title"),
    as: DataImportExportGuideSteps,
    asProps: {
      source: props.source,
    },
  },
])
</script>

<template>
  <DataImportCard>
    <UiAccordion
      :class="$style.accordion"
      :items="items"
    />
  </DataImportCard>
</template>

<style module lang="scss">
.accordion {
  hr {
    display: none;
  }

  button {
    font-size: var(--fs-card-title);
    line-height: var(--lh-card-title);
    font-weight: var(--fw-medium);

    span {
      margin-right: unset;
      color: var(--c-text);
      width: 12px;
    }
  }
}
</style>
