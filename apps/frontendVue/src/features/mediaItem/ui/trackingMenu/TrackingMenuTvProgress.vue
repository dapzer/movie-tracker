<script lang="ts" setup>
import type { MediaItemTvProgressType, MediaItemType } from "@movie-tracker/types";
import { useI18n, useUpdateMediaItemTrackingDataApi, watch } from "#imports";
import { computed, ref } from "vue";
import { getCurrentMediaDetails } from "~/utils/getCurrentMediaDetails";
import UiTypography from "~/components/ui/UiTypography.vue";

interface TrackingMenuTvProgressProps {
  mediaItem: MediaItemType;
}

const props = defineProps<TrackingMenuTvProgressProps>();
const { locale } = useI18n();
const updateMediaItemTrackingDataApi = useUpdateMediaItemTrackingDataApi();

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaItem, locale.value);
});

const currentTvProgress = computed(() => {
  return props.mediaItem.trackingData.tvProgress
});

const currentValue = ref<MediaItemTvProgressType>({ ...currentTvProgress.value });

watch(() => props.mediaItem, () => {
  currentValue.value = { ...currentTvProgress.value };
}, { deep: true });

watch(() => currentValue.value.currentSeason, () => {
  currentValue.value.currentEpisode = 1;
});

const handleChange = () => {
  updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      tvProgress: currentValue.value
    }
  });
};

</script>

<template>
  <ul :class="$style.wrapper">
    <UiTypography
      as="li"
      variant="listItem"
    >
      {{ $t("mediaItem.trackingMenu.currentSeason") }}: <select
        v-model="currentValue.currentSeason"
        :disabled="updateMediaItemTrackingDataApi.isPending.value"
        @change="handleChange"
      >
        <option
          v-for="(season, index) in currentMediaDetails?.seasons"
          :key="season.id"
          :value="index"
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
        :disabled="updateMediaItemTrackingDataApi.isPending.value"
        @change="handleChange"
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
