<script setup lang="ts">
import type { MediaDetailsType } from "@movie-tracker/types"
import { useGetActiveTvWatchCycleByMediaItemIdApi } from "~/api/tvWatchCycles/useTvWatchCyclesApi.ts"
import MediaCardManagementMenuTvProgressState
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressState.vue"

interface MediaCardManagementMenuTvProgressProps {
  mediaItemId: string
  mediaDetails: MediaDetailsType
}

const props = defineProps<MediaCardManagementMenuTvProgressProps>()

const getActiveTvWatchCycleByMediaItemIdApi = useGetActiveTvWatchCycleByMediaItemIdApi({
  mediaItemId: props.mediaItemId,
})
</script>

<template>
  <MediaCardManagementMenuTvProgressState
    v-if="getActiveTvWatchCycleByMediaItemIdApi.data.value"
    :media-item-id="props.mediaItemId"
    :media-details="props.mediaDetails"
    :watch-cycle="getActiveTvWatchCycleByMediaItemIdApi.data.value"
  />
</template>

<style scoped lang="scss">

</style>
