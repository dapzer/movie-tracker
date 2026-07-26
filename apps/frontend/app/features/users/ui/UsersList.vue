<script setup lang="ts">
import type { GetUsersArgs } from "~/api/users/usersApiTypes"
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useGetUsersApi } from "~/api/users/useUsersApi"
import UserListFilters from "~/features/users/ui/UserListFilters.vue"
import UsersTable from "~/features/users/ui/usersTable/UsersTable.vue"
import { getPaginationParams } from "~/shared/utils/getPaginationParams"

const PAGE_SIZE = 10

const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const searchTerm = useRouteQuery<string>("searchTerm", "", {
  mode: "replace",
})

const getUsersArgs = computed<GetUsersArgs>(() => ({
  ...getPaginationParams({
    page: currentPage.value,
    itemsPerPage: PAGE_SIZE,
  }),
  searchTerm: searchTerm.value || undefined,
}))

const getUsersApi = useGetUsersApi(getUsersArgs)
await getUsersApi.suspense()

watch(() => getUsersApi.data.value?.items, (items) => {
  if (items && items.length === 0 && currentPage.value > 1) {
    currentPage.value = 1
  }
})

watch(searchTerm, () => {
  currentPage.value = 1
})
</script>

<template>
  <div>
    <UserListFilters v-model:search-term="searchTerm" />

    <UsersTable
      v-model:current-page="currentPage"
      :users="getUsersApi.data.value?.items"
      :total-count="getUsersApi.data.value?.totalCount"
      :items-per-page="PAGE_SIZE"
      :loading="getUsersApi.isFetching.value"
    />
  </div>
</template>

<style scoped lang="scss">

</style>
