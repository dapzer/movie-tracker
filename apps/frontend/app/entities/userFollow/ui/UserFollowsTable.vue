<script setup lang="ts">
import type { UserFollowType } from "@movie-tracker/types"
import UserFollowsTableRow from "~/entities/userFollow/ui/UserFollowsTableRow.vue"
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiTable, UiTableBody, UiTableCell, UiTableHead, UiTableHeader, UiTableRow } from "~/shared/ui/UiTable"

interface UserFollowsTableProps {
  data?: UserFollowType[]
  loading: boolean
  loadingItemsCount: number
}

const props = defineProps<UserFollowsTableProps>()
</script>

<template>
  <UiTable>
    <UiTableHeader>
      <UiTableRow>
        <UiTableHead :width="300">
          {{ $t("userFollow.table.user") }}
        </UiTableHead>
        <UiTableHead :width="264">
          {{ $t("userFollow.table.following") }}
        </UiTableHead>
        <UiTableHead :width="264">
          {{ $t("userFollow.table.userFollowers") }}
        </UiTableHead>
        <UiTableHead :width="170">
          <!-- Action empty column -->
        </UiTableHead>
      </UiTableRow>
    </UiTableHeader>
    <UiTableBody>
      <template v-if="!props.loading">
        <UserFollowsTableRow
          v-for="follow in props.data"
          :key="follow.id"
          :follow="follow"
        />
      </template>
      <template v-else>
        <UiTableRow
          v-for="i of loadingItemsCount"
          :key="i"
        >
          <UiTableCell><UiSkeleton /></UiTableCell>
          <UiTableCell><UiSkeleton /></UiTableCell>
          <UiTableCell><UiSkeleton /></UiTableCell>
          <UiTableCell><UiSkeleton /></UiTableCell>
        </UiTableRow>
      </template>
    </UiTableBody>
  </UiTable>
</template>

<style module lang="scss">
</style>
