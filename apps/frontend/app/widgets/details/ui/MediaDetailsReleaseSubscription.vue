<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { computed } from "vue"
import { useGetReleaseSubscriptionByMediaIdApi } from "~/api/releaseSubscription/useReleaseSubscriptionApi"
import { ReleaseSubscruptionButton } from "~/features/releaseSubscriptions"

interface MediaDetailsReleaseSubscriptionProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  releaseDate?: string
}

const props = defineProps<MediaDetailsReleaseSubscriptionProps>()

const getReleaseSubscriptionApi = useGetReleaseSubscriptionByMediaIdApi({
  mediaId: props.mediaId,
})

const isReleased = computed(() => {
  if (!props.releaseDate)
    return false
  const releaseDate = new Date(props.releaseDate)
  const currentDate = new Date()
  currentDate.setHours(0, 0, 0, 0)
  return releaseDate <= currentDate
})
</script>

<template>
  <!-- TODO: Add tooltip -->
  <ReleaseSubscruptionButton
    :media-id="props.mediaId"
    :media-type="props.mediaType"
    :subscription="getReleaseSubscriptionApi.data.value"
    :disabled="isReleased"
  />
</template>

<style module lang="scss">
.icon {
  color: var(--c-description);
}
</style>
