<script setup lang="ts">
import type { ReleaseSubscriptionWithDetailsType } from "@movie-tracker/types"
import ReleaseSubscriptionsTableRow from "~/features/releaseSubscriptions/ui/ReleaseSubscriptionsTableRow.vue"
import ReleaseSubscriptionsTableRowSkeleton
  from "~/features/releaseSubscriptions/ui/ReleaseSubscriptionsTableRowSkeleton.vue"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiTable, UiTableBody, UiTableHead, UiTableHeader, UiTableRow } from "~/shared/ui/UiTable"

interface ReleaseSubscriptionsTableProps {
  data?: ReleaseSubscriptionWithDetailsType[]
  totalCount?: number
  itemsPerPage?: number
  loading?: boolean
}

const props = withDefaults(defineProps<ReleaseSubscriptionsTableProps>(), {
  itemsPerPage: 10,
})
const currentPage = defineModel<number>("currentPage", { default: 1 })
</script>

<template>
  <UiTable>
    <UiTableHeader>
      <UiTableRow>
        <UiTableHead :width="400">
          {{ $t("releaseSubscription.table.title") }}
        </UiTableHead>
        <UiTableHead :width="394">
          {{ $t("releaseSubscription.table.latestUpdate") }}
        </UiTableHead>
        <UiTableHead :width="394">
          <!-- Action empty column -->
        </UiTableHead>
      </UiTableRow>
    </UiTableHeader>

    <UiTableBody>
      <template v-if="!props.loading">
        <ReleaseSubscriptionsTableRow
          v-for="subscription in props.data"
          :key="subscription.id"
          :subscription="subscription"
        />
      </template>
      <template v-else>
        <ReleaseSubscriptionsTableRowSkeleton
          v-for="i of props.itemsPerPage"
          :key="i"
        />
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
