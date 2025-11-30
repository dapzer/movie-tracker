<script setup lang="ts">
import { onServerPrefetch } from "#imports"
import { useGetMediaListsByUserIdApi } from "~/api/mediaList/useMediaListApi"
import { MediaListCard, MediaListCardSkeleton } from "~/entities/mediaList"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiListsGrid } from "~/shared/ui/UiListsGrid"

interface UserProfileListsProps {
  userId: string
  listsCount?: number
}

const props = defineProps<UserProfileListsProps>()

const getMediaListsByUserIdApi = useGetMediaListsByUserIdApi(props.userId)
onServerPrefetch(async () => {
  await getMediaListsByUserIdApi.suspense()
})
</script>

<template>
  <UiAttention
    v-if="(!getMediaListsByUserIdApi.data.value?.length && !getMediaListsByUserIdApi.isLoading.value) || !props.listsCount"
    :title="$t('userProfile.noLists')"
  />
  <UiListsGrid v-else>
    <template v-if="!getMediaListsByUserIdApi.isLoading.value">
      <MediaListCard
        v-for="list in getMediaListsByUserIdApi.data.value"
        :key="list.id"
        :list="list"
      />
    </template>
    <template v-else>
      <MediaListCardSkeleton
        v-for="i in props.listsCount"
        :key="i"
        hide-user
      />
    </template>
  </UiListsGrid>
</template>

<style scoped lang="scss">

</style>
