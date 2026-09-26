<script setup lang="ts">
import type { MediaItemStatusNameEnum, MediaListType } from "@movie-tracker/types"
import type { DataImportProcessingListMode } from "~/features/dataImport/model/useDataImportProcessingOptions"
import {
  MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT,
  MediaItemStatusNameEnum as StatusEnum,
} from "@movie-tracker/types"
import { toRef } from "vue"
import { useDataImportProcessingOptions } from "~/features/dataImport/model/useDataImportProcessingOptions"
import DataImportProcessingField from "~/features/dataImport/ui/processing/DataImportProcessingField.vue"
import DataImportProcessingToggleCard from "~/features/dataImport/ui/processing/DataImportProcessingToggleCard.vue"
import { UiInput } from "~/shared/ui/UiInput"
import { UiSegmentedControl } from "~/shared/ui/UiSegmentedControl"
import { UiSelect } from "~/shared/ui/UiSelect"

export type { DataImportProcessingListMode } from "~/features/dataImport/model/useDataImportProcessingOptions"

interface DataImportProcessingBucketCardProps {
  title: string
  foundCount: number
  failedCount: number
  mediaLists?: MediaListType[]
  disabled?: boolean
}

const props = defineProps<DataImportProcessingBucketCardProps>()

const enabled = defineModel<boolean>("enabled", { default: false })
const listMode = defineModel<DataImportProcessingListMode>("listMode", { default: "new" })
const newListTitle = defineModel<string>("newListTitle", { default: "" })
const newListTitleError = defineModel<string>("newListTitleError", { default: "" })
const mediaListId = defineModel<string>("mediaListId", { default: "" })
const status = defineModel<MediaItemStatusNameEnum>("status", { default: StatusEnum.VIEWED })

const { listModeOptions, mediaListOptions, statusOptions } = useDataImportProcessingOptions(
  toRef(props, "mediaLists"),
)
</script>

<template>
  <DataImportProcessingToggleCard
    v-model:enabled="enabled"
    :title="props.title"
    :found-count="props.foundCount"
    :failed-count="props.failedCount"
    :disabled="props.disabled"
  >
    <div :class="$style.fields">
      <UiSegmentedControl
        v-model="listMode"
        :options="listModeOptions"
        :disabled="props.disabled"
      />

      <template v-if="listMode === 'new'">
        <DataImportProcessingField :label="$t('dataImport.processing.newListName')">
          <UiInput
            v-model="newListTitle"
            as="div"
            :maxlength="MEDIA_LIST_TITLE_MAX_LENGTH_LIMIT"
            :error="newListTitleError"
            :placeholder="$t('dataImport.processing.newListNamePlaceholder')"
            :disabled="props.disabled"
          />
        </DataImportProcessingField>
      </template>

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
</style>
