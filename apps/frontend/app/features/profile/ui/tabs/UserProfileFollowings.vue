<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import type { GetUserFollowingsApiArgs } from "~/api/userFollow/userFollowApiTypes"
import { computed, ref } from "vue"
import { useGetUserFollowingsApi } from "~/api/userFollow/useUserFollowApi"
import { UserFollowsTable } from "~/entities/userFollow"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiPagination } from "~/shared/ui/UiPagination"

interface UserProfileFollowingsProps {
  user: UserPublicType
}

const props = defineProps<UserProfileFollowingsProps>()

const currentPage = ref(1)
const getUserFollowingsApiArgs = computed<GetUserFollowingsApiArgs>(() => {
  return {
    userId: props.user.id,
    page: currentPage,
    limit: 10,
  }
})

const getUserFollowingsApi = useGetUserFollowingsApi(getUserFollowingsApiArgs)
</script>

<template>
  <UiAttention
    v-if="!getUserFollowingsApi.isPending.value && !getUserFollowingsApi.data.value?.items.length"
    :title="$t('userFollow.noFollowings')"
  />
  <template v-else>
    <UserFollowsTable
      :loading-items-count="8"
      :loading="getUserFollowingsApi.isPending.value"
      :data="getUserFollowingsApi.data.value?.items"
    />
    <UiPagination
      v-if="getUserFollowingsApi.data.value?.totalCount"
      v-model="currentPage"
      :class="$style.pagination"
      :total-items="getUserFollowingsApi.data.value?.totalCount"
      :pages-on-sides="1"
      :items-per-page="20"
    />
  </template>
</template>

<style module lang="scss">
.pagination {
  margin-top: 24px;
}
</style>
