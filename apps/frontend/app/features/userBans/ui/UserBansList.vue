<script setup lang="ts">
import type { UserBanStatusFilter } from "@movie-tracker/types"
import type { GetUserBansArgs } from "~/api/userBans/userBansApiTypes"
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useGetUserBansApi } from "~/api/userBans/useUserBansApi"
import UserBansTable from "~/features/userBans/ui/userBansTable/UserBansTable.vue"
import { getPaginationParams } from "~/shared/utils/getPaginationParams"
import UserBansFilters from "./filters/UserBansFilters.vue"

const PAGE_SIZE = 10

const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const userId = useRouteQuery<string>("userId", "", {
  mode: "replace",
})
const statuses = useRouteQuery<string, UserBanStatusFilter[]>("status", "", {
  mode: "replace",
  transform: {
    get: value => value
      ? value.split(",") as UserBanStatusFilter[]
      : [],
    set: value => value.length ? value.join(",") : "",
  },
})

const getUserBansArgs = computed<GetUserBansArgs>(() => ({
  ...getPaginationParams({
    page: currentPage.value,
    itemsPerPage: PAGE_SIZE,
  }),
  status: statuses.value.length ? statuses.value : undefined,
  userId: userId.value || undefined,
}))

const getUserBansApi = useGetUserBansApi(getUserBansArgs)
await getUserBansApi.suspense()

watch(() => getUserBansApi.data.value?.items, (items) => {
  if (items && items.length === 0 && currentPage.value > 1) {
    currentPage.value = 1
  }
})

watch([userId, statuses], () => {
  currentPage.value = 1
})
</script>

<template>
  <div>
    <UserBansFilters
      v-model:user-id="userId"
      v-model:statuses="statuses"
    />

    <UserBansTable
      v-model:current-page="currentPage"
      :user-bans="getUserBansApi.data.value?.items"
      :total-count="getUserBansApi.data.value?.totalCount"
      :items-per-page="PAGE_SIZE"
      :loading="getUserBansApi.isFetching.value"
    />
  </div>
</template>
