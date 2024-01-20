<script setup lang="ts">

import UiTypography from "~/components/ui/UiTypography.vue";
import type { MediaItemType } from "@movie-tracker/types";

interface MediaItemCardTvInfoProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaItemCardTvInfoProps>();
</script>

<template>
  <ul
    :class="$style.tvProgress"
  >
    <UiTypography
      as="li"
      variant="listItem"
    >
      {{ $t("mediaItem.trackingMenu.currentSeason") }}:
      <UiTypography
        variant="listItem"
        as="span"
      >
        {{ props.mediaItem.trackingData.seriesInfo?.currentSeason || 1 }}
      </UiTypography>
    </UiTypography>
    <UiTypography
      as="li"
      variant="listItem"
    >
      {{ $t("mediaItem.trackingMenu.currentEpisode") }}:
      <UiTypography
        variant="listItem"
        as="span"
      >
        {{ props.mediaItem.trackingData.seriesInfo?.currentEpisode || 1 }}
      </UiTypography>
    </UiTypography>
  </ul>
</template>

<style module lang="scss">
.tvProgress {
  padding-top: 6px;

  li, span {
    font-size: var(--fs-span);
  }
}
</style>
