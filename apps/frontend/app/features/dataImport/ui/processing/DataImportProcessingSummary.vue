<script setup lang="ts">
import type { DataImportStatusEnum, DataImportType } from "@movie-tracker/types"
import type { UiTagColor } from "~/shared/ui/UiTag"
import { useI18n } from "#imports"
import { DataImportStatusEnum as StatusEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { UiStatCard } from "~/shared/ui/UiStatCard"
import { UiTag } from "~/shared/ui/UiTag"
import { UiTypography } from "~/shared/ui/UiTypography"

interface DataImportProcessingSummaryProps {
  dataImport: DataImportType
}

const props = defineProps<DataImportProcessingSummaryProps>()

const { locale } = useI18n()

const statusColors: Record<DataImportStatusEnum, UiTagColor> = {
  [StatusEnum.PENDING]: "orange",
  [StatusEnum.PROCESSING]: "blue",
  [StatusEnum.COMPLETED]: "green",
  [StatusEnum.FAILED]: "tertiary",
}

const formattedDate = computed(() => {
  return new Date(props.dataImport.createdAt).toLocaleString(locale.value, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  })
})

const unrecognizedCount = computed(() => {
  const { watched, watchList, ratings, reviews, lists, notes } = props.dataImport.result

  return watched.failed.length
    + watchList.failed.length
    + ratings.failed.length
    + reviews.failed.length
    + lists.failed.length
    + notes.failed.length
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.meta">
      <UiTypography variant="label">
        {{ $t(`dataImport.sources.${props.dataImport.source}`) }}
      </UiTypography>
      <UiTypography variant="description">
        {{ formattedDate }}
      </UiTypography>
      <UiTag
        :color="statusColors[props.dataImport.status]"
        variant="boxed"
      >
        {{ $t(`dataImport.status.${props.dataImport.status.toLowerCase()}`) }}
      </UiTag>
    </div>

    <div :class="$style.stats">
      <UiStatCard
        :label="$t('dataImport.processing.stats.watched')"
        :value="props.dataImport.result.watched.success.length"
      />
      <UiStatCard
        :label="$t('dataImport.processing.stats.watchList')"
        :value="props.dataImport.result.watchList.success.length"
      />
      <UiStatCard
        :label="$t('dataImport.processing.stats.lists')"
        :value="props.dataImport.result.lists.success.length"
      />
      <UiStatCard
        :label="$t('dataImport.processing.stats.ratings')"
        :value="props.dataImport.result.ratings.success.length"
      />
      <UiStatCard
        :label="$t('dataImport.processing.stats.reviews')"
        :value="props.dataImport.result.reviews.success.length"
      />
      <UiStatCard
        :label="$t('dataImport.processing.stats.unrecognized')"
        :value="unrecognizedCount"
        variant="danger"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@use "~/shared/styles/mixins" as *;

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.meta {
  display: flex;
  align-items: center;
  gap: 12px;
  flex-wrap: wrap;
}

.stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 12px;

  @include mobilePlusDevice() {
    grid-template-columns: repeat(2, 1fr);
  }
}
</style>
