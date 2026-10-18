<script setup lang="ts">
import type { MediaDetailsType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { useGetActiveTvWatchCycleByMediaItemIdApi } from "~/api/tvWatchCycles/useTvWatchCyclesApi.ts"
import MediaCardManagementMenuTvProgressSeason
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressSeason.vue"
import MediaCardManagementMenuTvProgressState
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgressState.vue"
import { UiDivider } from "~/shared/ui/UiDivider"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails.ts"

interface MediaCardManagementMenuTvProgressProps {
  mediaItemId: string
  mediaDetails: MediaDetailsType
}

const props = defineProps<MediaCardManagementMenuTvProgressProps>()
const { locale } = useI18n()

const getActiveTvWatchCycleByMediaItemIdApi = useGetActiveTvWatchCycleByMediaItemIdApi({
  mediaItemId: props.mediaItemId,
})

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaDetails, locale.value)
})
</script>

<template>
  <div
    v-if="getActiveTvWatchCycleByMediaItemIdApi.data.value"
    :class="$style.wrapper"
  >
    <MediaCardManagementMenuTvProgressState
      :media-item-id="props.mediaItemId"
      :media-details="props.mediaDetails"
      :watch-cycle="getActiveTvWatchCycleByMediaItemIdApi.data.value"
    />
    <UiDivider />
    <MediaCardManagementMenuTvProgressSeason
      v-for="season in currentMediaDetails?.seasons"
      :key="season.seasonNumber"
      :season="season"
      :watch-cycle="getActiveTvWatchCycleByMediaItemIdApi.data.value"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
