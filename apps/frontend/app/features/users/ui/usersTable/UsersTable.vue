<script setup lang="ts">
import type { ManagedUserType } from "@movie-tracker/types"
import UsersTableRow from "~/features/users/ui/usersTable/UsersTableRow.vue"
import UsersTableRowSkeleton from "~/features/users/ui/usersTable/UsersTableRowSkeleton.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiTable, UiTableBody, UiTableHead, UiTableHeader, UiTableRow } from "~/shared/ui/UiTable"

interface UsersTableProps {
  users?: ManagedUserType[]
  totalCount?: number
  itemsPerPage?: number
  loading?: boolean
}

const props = withDefaults(defineProps<UsersTableProps>(), {
  itemsPerPage: 20,
})

const currentPage = defineModel<number>("currentPage", { default: 1 })
</script>

<template>
  <div :class="$style.wrapper">
    <UiTable>
      <UiTableHeader>
        <UiTableRow>
          <UiTableHead :width="300">
            {{ $t("users.table.user") }}
          </UiTableHead>
          <UiTableHead :width="240">
            {{ $t("users.table.email") }}
          </UiTableHead>
          <UiTableHead :width="160">
            {{ $t("users.table.roles") }}
          </UiTableHead>
          <UiTableHead :width="160">
            {{ $t("users.table.signUpMethod") }}
          </UiTableHead>
          <UiTableHead :width="150">
            {{ $t("users.table.status") }}
          </UiTableHead>
          <UiTableHead :width="180">
            {{ $t("users.table.joined") }}
          </UiTableHead>
          <UiTableHead :width="180">
            {{ $t("users.table.updated") }}
          </UiTableHead>
          <UiTableHead
            :width="120"
            align="right"
          >
            {{ $t("users.table.actions") }}
          </UiTableHead>
        </UiTableRow>
      </UiTableHeader>

      <UiTableBody>
        <template v-if="props.loading">
          <UsersTableRowSkeleton
            v-for="i in props.itemsPerPage"
            :key="i"
          />
        </template>

        <template v-else-if="props.users?.length">
          <UsersTableRow
            v-for="user in props.users"
            :key="user.id"
            :user="user"
          />
        </template>
      </UiTableBody>
    </UiTable>

    <UiAttention
      v-if="!props.loading && !props.users?.length"
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
