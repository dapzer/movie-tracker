<script setup lang="ts">
import type { DataImportListItemType, DataImportStatusEnum } from "@movie-tracker/types"
import type { UiTagColor } from "~/shared/ui/UiTag"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { DataImportStatusEnum as StatusEnum } from "@movie-tracker/types"
import { UiButton } from "~/shared/ui/UiButton"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiTable, UiTableBody, UiTableCell, UiTableHead, UiTableHeader, UiTableRow } from "~/shared/ui/UiTable"
import { UiTag } from "~/shared/ui/UiTag"
import { UiTypography } from "~/shared/ui/UiTypography"

interface DataImportHistoryTableProps {
  data?: DataImportListItemType[]
  totalCount?: number
  itemsPerPage?: number
  loading?: boolean
}

const props = withDefaults(defineProps<DataImportHistoryTableProps>(), {
  itemsPerPage: 10,
})

const currentPage = defineModel<number>("currentPage", { default: 1 })

const { t, locale } = useI18n()
const localePath = useLocalePath()

const statusColors: Record<DataImportStatusEnum, UiTagColor> = {
  [StatusEnum.PENDING]: "orange",
  [StatusEnum.PROCESSING]: "blue",
  [StatusEnum.COMPLETED]: "green",
  [StatusEnum.FAILED]: "tertiary",
}

function formatDate(value: Date | string) {
  return new Date(value).toLocaleString(locale.value, {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit",
  })
}
</script>

<template>
  <UiTable>
    <UiTableHeader>
      <UiTableRow>
        <UiTableHead :width="142">
          {{ $t("dataImport.history.table.source") }}
        </UiTableHead>
        <UiTableHead :width="216">
          {{ $t("dataImport.history.table.date") }}
        </UiTableHead>
        <UiTableHead :width="146">
          {{ $t("dataImport.history.table.status") }}
        </UiTableHead>
        <UiTableHead :width="138" />
      </UiTableRow>
    </UiTableHeader>

    <UiTableBody>
      <template v-if="!props.loading">
        <UiTableRow
          v-for="item in props.data"
          :key="item.id"
        >
          <UiTableCell>
            <UiTypography variant="labelSmall">
              {{ t(`dataImport.sources.${item.source}`) }}
            </UiTypography>
          </UiTableCell>
          <UiTableCell>
            <UiTypography variant="description">
              {{ formatDate(item.createdAt) }}
            </UiTypography>
          </UiTableCell>
          <UiTableCell>
            <UiTag :color="statusColors[item.status]">
              {{ t(`dataImport.status.${item.status.toLowerCase()}`) }}
            </UiTag>
          </UiTableCell>
          <UiTableCell>
            <UiButton
              v-if="item.status !== StatusEnum.COMPLETED"
              :as="NuxtLink"
              size="small"
              scheme="gray"
              :to="localePath(`/data-import/${item.id}`)"
            >
              {{ $t("dataImport.history.process") }}
            </UiButton>
          </UiTableCell>
        </UiTableRow>
      </template>
      <template v-else>
        <UiTableRow
          v-for="i of props.itemsPerPage"
          :key="i"
        >
          <UiTableCell>
            <UiSkeleton
              :width="90"
              :height="20"
              is-fixed-width
            />
          </UiTableCell>
          <UiTableCell>
            <UiSkeleton
              :width="180"
              :height="20"
              is-fixed-width
            />
          </UiTableCell>
          <UiTableCell>
            <UiSkeleton
              :width="100"
              :height="24"
              is-fixed-width
            />
          </UiTableCell>
        </UiTableRow>
      </template>
    </UiTableBody>
  </UiTable>

  <UiPagination
    v-if="props.totalCount"
    v-model="currentPage"
    :class="$style.pagination"
    :total-items="props.totalCount"
    :pages-on-sides="1"
    :items-per-page="props.itemsPerPage"
  />
</template>

<style module lang="scss">
.pagination {
  margin-top: 24px;
}
</style>
