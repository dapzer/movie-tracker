<script setup lang="ts">
import type { GetDataImportsArgs } from "~/api/dataImport/dataImportApiTypes.ts"
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useGetDataImportsApi } from "~/api/dataImport/useDataImportApi"
import DataImportHistoryTable from "~/features/dataImport/ui/DataImportHistoryTable.vue"
import DataImportUploadForm from "~/features/dataImport/ui/uploadForm/DataImportUploadForm.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getPaginationParams } from "~/shared/utils/getPaginationParams.ts"

const PAGE_SIZE = 10

const page = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})

const getDataImportsQueryParams = computed<GetDataImportsArgs>(() => {
  return getPaginationParams({
    page: page.value,
    itemsPerPage: PAGE_SIZE,
  })
})

const getDataImportsApi = useGetDataImportsApi(getDataImportsQueryParams)

await getDataImportsApi.suspense()

watch(() => getDataImportsApi.data.value?.items, (newValue) => {
  if (newValue && newValue.length === 0 && page.value > 1) {
    page.value = 1
  }
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <div :class="$style.header">
      <UiTypography
        as="h1"
        variant="title2"
      >
        {{ $t("dataImport.pageTitle") }}
      </UiTypography>

      <UiDivider />
    </div>

    <div :class="$style.content">
      <DataImportUploadForm />

      <UiDivider />

      <div :class="$style.history">
        <UiTypography
          as="h2"
          variant="title4"
        >
          {{ $t("dataImport.history.title") }}
        </UiTypography>

        <UiAttention
          v-if="getDataImportsApi.data.value?.totalCount === 0"
          :indent="24"
          :title="$t('dataImport.history.empty.title')"
          :description="$t('dataImport.history.empty.description')"
        />

        <DataImportHistoryTable
          v-else
          v-model:current-page="page"
          :data="getDataImportsApi.data.value?.items"
          :total-count="getDataImportsApi.data.value?.totalCount"
          :items-per-page="PAGE_SIZE"
          :loading="getDataImportsApi.isFetching.value"
        />
      </div>
    </div>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  max-width: 640px;
  margin-top: 60px;
}

.header {
  margin-bottom: 16px;

  h1 {
    margin-bottom: 20px;
  }
}

.content {
  margin-top: 32px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.history {
  display: flex;
  flex-direction: column;
  gap: 12px;
}
</style>
