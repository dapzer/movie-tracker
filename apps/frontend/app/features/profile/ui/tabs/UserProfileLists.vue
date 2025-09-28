<script setup lang="ts">
import { useGetMediaListsByUserIdApi } from "~/api/mediaList/useMediaListApi"
import { MediaListCard } from "~/entities/mediaList"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiListsGrid } from "~/shared/ui/UiListsGrid"

interface UserProfileListsProps {
  userId: string
}

const props = defineProps<UserProfileListsProps>()

const getMediaListsByUserIdApi = useGetMediaListsByUserIdApi(props.userId)
await getMediaListsByUserIdApi.suspense()
</script>

<template>
  <UiAttention
    v-if="!getMediaListsByUserIdApi.data.value?.length"
    :title="$t('userProfile.noLists')"
  />
  <UiListsGrid>
    <MediaListCard
      v-for="list in getMediaListsByUserIdApi.data.value"
      :key="list.id"
      :list="list"
    />
  </UiListsGrid>
</template>

<style scoped lang="scss">

</style>
