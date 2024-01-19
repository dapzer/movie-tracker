<script lang="ts" setup>
import type { MediaItemSeriesInfoType, MediaItemType } from "@movie-tracker/types";
import { useI18n, useUpdateMediaItemApi, watch } from "#imports";
import { computed, ref } from "vue";
import { getCurrentMediaDetails } from "~/utils/getCurrentMediaDetails";
import UiTypography from "~/components/ui/UiTypography.vue";

interface TrackingMenuTvProgressProps {
  mediaItem: MediaItemType;
}

const props = defineProps<TrackingMenuTvProgressProps>();
const { locale } = useI18n();
const updateMediaItemApi = useUpdateMediaItemApi();

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaItem, locale.value);
});

const currentValue = ref<MediaItemSeriesInfoType>({
  currentSeason: props.mediaItem.trackingData?.seriesInfo?.currentSeason || 0,
  currentEpisode: props.mediaItem.trackingData?.seriesInfo?.currentEpisode || 1
});

watch(() => currentValue.value.currentSeason, () => {
  currentValue.value.currentEpisode = 1;
});

watch(() => currentValue.value, () => {
  updateMediaItemApi.mutateAsync({
    mediaItemId: props.mediaItem.id,
    body: {
      ...props.mediaItem.trackingData,
      seriesInfo: currentValue.value
    }
  });
}, { deep: true });

</script>

<template>
  <ul :class="$style.wrapper">
    <UiTypography
      as="li"
      variant="listItem"
    >
      {{ $t("mediaItem.trackingMenu.currentSeason") }}: <select
        v-model="currentValue.currentSeason"
        :disabled="updateMediaItemApi.isPending.value"
      >
        <option
          v-for="season in currentMediaDetails?.seasons"
          :key="season.id"
          :value="season.season_number"
        >
          {{ season.name }}
        </option>
      </select>
    </UiTypography>
    <UiTypography
      as="li"
      variant="listItem"
    >
      {{ $t("mediaItem.trackingMenu.currentEpisode") }}: <select
        v-model="currentValue.currentEpisode"
        :disabled="updateMediaItemApi.isPending.value"
      >
        <option
          v-for="episode in currentMediaDetails?.seasons?.[currentValue.currentSeason]?.episode_count"
          :key="episode"
          :value="episode"
        >
          {{ episode }}
        </option>
      </select>
    </UiTypography>
  </ul>
</template>

<style lang="scss" module>
.wrapper {
  padding-top: 10px;
  gap: 6px;
  display: flex;
  flex-direction: column;

  li {
    display: flex;
    white-space: nowrap;
    gap: 6px;
  }

  select {
    background: none;
    color: var(--c-secondary);
    width: 100%;
    padding: 0 6px;

    option {
      color: #000;
    }
  }
}
</style>
