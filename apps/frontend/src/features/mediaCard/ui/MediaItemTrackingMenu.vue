<script setup lang="ts">

import { type MediaItemType, MediaTypeEnum } from "@movie-tracker/types"
import MediaItemTrackingMenuSitesToView from "~/features/mediaCard/ui/MediaItemTrackingMenuSitesToView.vue"
import { UiDivider } from "../../../shared/ui/UiDivider"
import MediaItemTrackingMenuTvProgress from "~/features/mediaCard/ui/MediaItemTrackingMenuTvProgress.vue"
import MediaItemTrackingMenuNote from "~/features/mediaCard/ui/MediaItemTrackingMenuNote.vue"

interface MediaItemTrackingMenuProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaItemTrackingMenuProps>();
</script>

<template>
  <div :class="$style.wrapper">
    <MediaItemTrackingMenuSitesToView :media-item="props.mediaItem" />
    <UiDivider />
    <template v-if="props.mediaItem.mediaDetails?.mediaType === MediaTypeEnum.TV">
      <MediaItemTrackingMenuTvProgress :media-item="props.mediaItem" />
      <UiDivider />
    </template>
    <MediaItemTrackingMenuNote :media-item="props.mediaItem" />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  padding: 0 6px;
}
</style>
