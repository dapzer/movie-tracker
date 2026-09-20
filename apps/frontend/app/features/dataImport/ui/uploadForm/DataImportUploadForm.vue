<script setup lang="ts">
import type { DataImportSourceEnum } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { useRouter } from "#vue-router"
import { FetchError } from "@movie-tracker/utils"
import { computed, ref, watch } from "vue"
import { toast } from "vue3-toastify"
import { useImportDataApi } from "~/api/dataImport/useDataImportApi.ts"
import DataImportSection from "~/features/dataImport/ui/DataImportSection.vue"
import DataImportDropzone from "~/features/dataImport/ui/uploadForm/DataImportDropzone.vue"
import DataImportExportGuide from "~/features/dataImport/ui/uploadForm/DataImportExportGuide.vue"
import DataImportSourceSelect from "~/features/dataImport/ui/uploadForm/DataImportSourceSelect.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiDivider } from "~/shared/ui/UiDivider"

const { t } = useI18n()

const source = ref<DataImportSourceEnum>()
const file = ref<File | null>(null)
const router = useRouter()

const importDataApi = useImportDataApi()

watch(source, () => {
  file.value = null
})

const isSubmitDisabled = computed(() => {
  return !source.value || !file.value || importDataApi.isPending.value
})

async function onSubmit() {
  if (!source.value || !file.value) {
    return
  }

  try {
    const data = await importDataApi.mutateAsync({
      source: source.value,
      file: file.value,
    })
    router.push(`/data-import/${data.importId}`)
    toast.success(t("toasts.dataImport.successImported"))
  }
  catch (error) {
    if (error instanceof FetchError && error.statusCode === 429) {
      toast.error(t("toasts.rateLimitExceeded"))
    }
    else {
      toast.error(t("toasts.dataImport.unsuccessfullyImported"))
    }
  }
}
</script>

<template>
  <div :class="$style.wrapper">
    <DataImportSection :label="$t('dataImport.sourceLabel')">
      <DataImportSourceSelect v-model="source" />
    </DataImportSection>

    <template v-if="source">
      <UiDivider />

      <DataImportExportGuide :source="source" />
      <UiDivider />

      <DataImportSection :label="$t('dataImport.dropzone.title')">
        <div>
          <DataImportDropzone v-model="file" />
          <UiButton
            :class="$style.submitButton"
            :disabled="isSubmitDisabled"
            @click="onSubmit"
          >
            {{ $t("dataImport.submit") }}
          </UiButton>
        </div>
      </DataImportSection>
    </template>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.submitButton {
  width: 100%;
  margin-top: 12px;
}
</style>
