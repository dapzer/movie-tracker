<script setup lang="ts">
import type { DataImportListType, MediaItemStatusNameEnum, MediaListType } from "@movie-tracker/types"
import type { DataImportProcessingListMode } from "~/features/dataImport/model/useDataImportProcessingOptions"
import { MediaItemStatusNameEnum as StatusEnum } from "@movie-tracker/types"
import { toRef } from "vue"
import { useDataImportProcessingOptions } from "~/features/dataImport/model/useDataImportProcessingOptions"
import DataImportProcessingField from "~/features/dataImport/ui/processing/DataImportProcessingField.vue"
import DataImportProcessingToggleCard from "~/features/dataImport/ui/processing/DataImportProcessingToggleCard.vue"
import { UiSegmentedControl } from "~/shared/ui/UiSegmentedControl"
import { UiSelect } from "~/shared/ui/UiSelect"
import { UiTypography } from "~/shared/ui/UiTypography"

interface DataImportProcessingListCardProps {
  list: DataImportListType
  mediaLists?: MediaListType[]
  disabled?: boolean
}

const props = defineProps<DataImportProcessingListCardProps>()

const enabled = defineModel<boolean>("enabled", { default: false })
const listMode = defineModel<DataImportProcessingListMode>("listMode", { default: "new" })
const mediaListId = defineModel<string>("mediaListId", { default: "" })
const status = defineModel<MediaItemStatusNameEnum>("status", { default: StatusEnum.VIEWED })

const { listModeOptions, mediaListOptions, statusOptions } = useDataImportProcessingOptions(
  toRef(props, "mediaLists"),
)
</script>

<template>
  <DataImportProcessingToggleCard
    v-model:enabled="enabled"
    :title="props.list.title"
    :found-count="props.list.items.success.length"
    :failed-count="props.list.items.failed.length"
    :disabled="props.disabled"
  >
    <div :class="$style.fields">
      <UiSegmentedControl
        v-model="listMode"
        :options="listModeOptions"
        :disabled="props.disabled"
      />

      <UiTypography
        v-if="listMode === 'new'"
        :class="$style.hint"
        variant="description"
      >
        {{ $t("dataImport.processing.newListHint", { title: props.list.title }) }}
      </UiTypography>

      <template v-else>
        <DataImportProcessingField :label="$t('dataImport.processing.list')">
          <UiSelect
            v-model="mediaListId"
            :options="mediaListOptions"
            :placeholder="$t('dataImport.processing.listPlaceholder')"
            :disabled="props.disabled"
          />
        </DataImportProcessingField>
      </template>

      <DataImportProcessingField :label="$t('dataImport.processing.status')">
        <UiSelect
          v-model="status"
          :options="statusOptions"
          :disabled="props.disabled"
        />
      </DataImportProcessingField>
    </div>
  </DataImportProcessingToggleCard>
</template>

<style module lang="scss">
.fields {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.hint {
  color: var(--c-description);
}
</style>
