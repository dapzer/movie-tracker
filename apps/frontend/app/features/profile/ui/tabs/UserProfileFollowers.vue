<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import type { GetUserFollowersApiArgs } from "~/api/userFollow/userFollowApiTypes"
import { computed, ref } from "vue"
import { useGetUserFollowersApi } from "~/api/userFollow/useUserFollowApi"
import { UserFollowsTable } from "~/entities/userFollow"
import { UiPagination } from "~/shared/ui/UiPagination"

interface UserProfileFollowersProps {
  user: UserPublicType
}

const props = defineProps<UserProfileFollowersProps>()

const currentPage = ref(1)
const getUserFollowersApiArgs = computed<GetUserFollowersApiArgs>(() => {
  return {
    userId: props.user.id,
    page: currentPage,
    limit: 20,
  }
})

const getUserFollowersApi = useGetUserFollowersApi(getUserFollowersApiArgs)
</script>

<template>
  <UserFollowsTable :data="getUserFollowersApi.data.value?.items" />
  <UiPagination
    v-if="getUserFollowersApi.data.value?.totalCount"
    v-model="currentPage"
    :class="$style.pagination"
    :total-items="getUserFollowersApi.data.value?.totalCount"
    :pages-on-sides="1"
    :items-per-page="20"
  />
</template>

<style module lang="scss">
.pagination {
  margin-top: 24px;
}
</style>
