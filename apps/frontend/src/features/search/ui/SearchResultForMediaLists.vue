<script setup lang="ts">
import type { MediaListType } from "@movie-tracker/types"
import { MediaListCard, MediaListCardSkeleton } from "~/entities/mediaList"
import { UiListsGridVertical } from "~/shared/ui/UiListsGrid"

interface SearchResultForMediaListsProps {
  items: MediaListType[]
  isLoading: boolean
}

const props = defineProps<SearchResultForMediaListsProps>()
</script>

<template>
  <UiListsGridVertical
    v-if="props.isLoading || props.items.length"
    :items="props.isLoading ? Array(20).fill('_') as MediaListType[]
      : props.items"
  >
    <template #default="{ item }">
      <MediaListCard
        v-if="!props.isLoading"
        :list="item"
        horizontal
        hide-access-level
      />
      <MediaListCardSkeleton
        v-else
        horizontal
      />
    </template>
  </UiListsGridVertical>
</template>

<style scoped lang="scss">

</style>
