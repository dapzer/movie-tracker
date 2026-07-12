<script setup lang="ts">
import type { UserBan } from "@movie-tracker/types"
import UserBansTableRow from "~/features/userBans/ui/userBansTable/UserBansTableRow.vue"
import UserBansTableRowSkeleton from "~/features/userBans/ui/userBansTable/UserBansTableRowSkeleton.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiTable, UiTableBody, UiTableHead, UiTableHeader, UiTableRow } from "~/shared/ui/UiTable"

interface UserBansTableProps {
  userBans?: UserBan[]
  totalCount?: number
  itemsPerPage?: number
  loading?: boolean
}

const props = withDefaults(defineProps<UserBansTableProps>(), {
  itemsPerPage: 20,
})

const currentPage = defineModel<number>("currentPage", { default: 1 })
</script>

<template>
  <div :class="$style.wrapper">
    <UiTable>
      <UiTableHeader>
        <UiTableRow>
          <UiTableHead :width="280">
            {{ $t("userBans.table.user") }}
          </UiTableHead>
          <UiTableHead :width="120">
            {{ $t("userBans.table.status") }}
          </UiTableHead>
          <UiTableHead :width="140">
            {{ $t("userBans.table.reason") }}
          </UiTableHead>
          <UiTableHead :width="240">
            {{ $t("userBans.table.comment") }}
          </UiTableHead>
          <UiTableHead :width="260">
            {{ $t("userBans.table.issuer") }}
          </UiTableHead>
          <UiTableHead :width="180">
            {{ $t("userBans.table.expiresAt") }}
          </UiTableHead>
          <UiTableHead :width="180">
            {{ $t("userBans.table.createdAt") }}
          </UiTableHead>
        </UiTableRow>
      </UiTableHeader>

      <UiTableBody>
        <template v-if="props.loading">
          <UserBansTableRowSkeleton
            v-for="i in props.itemsPerPage"
            :key="i"
          />
        </template>

        <template v-else-if="props.userBans?.length">
          <UserBansTableRow
            v-for="userBan in props.userBans"
            :key="userBan.id"
            :user-ban="userBan"
          />
        </template>
      </UiTableBody>
    </UiTable>

    <UiAttention
      v-if="!props.loading && !props.userBans?.length"
      :title="$t('ui.nothingFound')"
      :indent="24"
    />

    <UiPagination
      v-if="props.totalCount"
      v-model="currentPage"
      :class="$style.pagination"
      :total-items="props.totalCount"
      :pages-on-sides="1"
      :items-per-page="props.itemsPerPage"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
}

.pagination {
  margin-top: 24px;
}
</style>
