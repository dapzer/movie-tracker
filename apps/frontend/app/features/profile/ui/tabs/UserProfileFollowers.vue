<script setup lang="ts">
import type { UserFollowInformationType, UserPublicType } from "@movie-tracker/types"
import type { GetUserFollowersApiArgs } from "~/api/userFollow/userFollowApiTypes"
import { onBeforeUnmount, onServerPrefetch } from "#imports"
import { useRouteQuery } from "@vueuse/router"
import { computed } from "vue"
import { useGetUserFollowersApi } from "~/api/userFollow/useUserFollowApi"
import { UserFollowsTable } from "~/entities/userFollow"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiPagination } from "~/shared/ui/UiPagination"

interface UserProfileFollowersProps {
  user: UserPublicType
  followInformation: UserFollowInformationType
}

const props = defineProps<UserProfileFollowersProps>()

const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})

const getUserFollowersApiArgs = computed<GetUserFollowersApiArgs>(() => {
  return {
    userId: props.user.id,
    limit: 10,
    offset: (currentPage.value - 1) * 10,
  }
})

const getUserFollowersApi = useGetUserFollowersApi(getUserFollowersApiArgs)
onServerPrefetch(async () => {
  await getUserFollowersApi.suspense()
})

onBeforeUnmount(() => {
  currentPage.value = 1
})

const skeletonsCount = computed(() => {
  return Math.min(
    (getUserFollowersApi.data.value?.items.length || getUserFollowersApiArgs.value.limit!),
    props.followInformation.followersCount,
  )
})
</script>

<template>
  <template v-if="skeletonsCount > 0">
    <UserFollowsTable
      :loading-items-count="skeletonsCount"
      :loading="getUserFollowersApi.isPending.value"
      :data="getUserFollowersApi.data.value?.items"
    />
    <UiPagination
      v-if="getUserFollowersApi.data.value?.totalCount"
      v-model="currentPage"
      :class="$style.pagination"
      :total-items="getUserFollowersApi.data.value?.totalCount"
      :pages-on-sides="1"
      :items-per-page="10"
    />
  </template>
  <UiAttention
    v-else
    :title="$t('userFollow.noFollowers')"
  />
</template>

<style module lang="scss">
.pagination {
  margin-top: 24px;
}
</style>
