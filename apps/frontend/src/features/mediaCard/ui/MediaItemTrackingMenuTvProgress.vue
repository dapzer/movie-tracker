<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { getCurrentMediaDetails, useI18n, watch } from "#imports"
import { useUpdateMediaItemTrackingDataApi } from "~/api/mediaItem/useMediaItemtApi"
import { computed, ref } from "vue"
import { UiTypography } from "../../../shared/ui/UiTypography"
import { type OptionType, UiSelect } from "../../../shared/ui/UiSelect"
import { toast } from "vue3-toastify";

interface MediaItemTrackingMenuTvProgressProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaItemTrackingMenuTvProgressProps>();
const { locale, t } = useI18n();
const updateMediaItemTrackingDataApi = useUpdateMediaItemTrackingDataApi();

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value);
});

const currentTvProgress = computed(() => {
  return props.mediaItem.trackingData.tvProgress
});

const currentValue = ref<{
  currentSeason: string;
  currentEpisode: string;
}>({
  currentSeason: currentTvProgress.value.currentSeason.toString(),
  currentEpisode: currentTvProgress.value.currentEpisode.toString()
});

watch(() => currentValue.value.currentSeason, () => {
  currentValue.value.currentEpisode = "1";
});

const seasonOptions = computed(() => {
  return currentMediaDetails.value?.seasons?.map((season, index) => ({
    label: season.name,
    value: index.toString()
  })) || [];
});

const episodeOptions = computed(() => {
  const result: Array<OptionType> = []
  const episodeCount = currentMediaDetails.value?.seasons?.[Number(currentValue.value.currentSeason)]?.episode_count;

  if (!episodeCount) {
    return result;
  }

  for (let i = 0; i < episodeCount; i++) {
    result.push({
      label: (i + 1).toString(),
      value: (i + 1).toString()
    });
  }
  return result;
});

const handleChange = () => {
  updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      tvProgress: {
        currentSeason: Number(currentValue.value.currentSeason),
        currentEpisode: Number(currentValue.value.currentEpisode)
      }
    }
  }).then(() => {
    toast.success(t("toasts.mediaItem.successTvProgressChanged"));
  }).catch(() => {
    toast.error(t("toasts.mediaItem.unsuccessfullyTvProgressChanged"));
  });
};
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.item">
      <UiTypography>
        {{ $t("mediaItem.trackingMenu.currentSeason") }}
      </UiTypography>
      <UiSelect
        v-model="currentValue.currentSeason"
        :width="184"
        :disabled="updateMediaItemTrackingDataApi.isPending.value"
        :options="seasonOptions"
        @update:model-value="handleChange"
      />
    </div>
    <div :class="$style.item">
      <UiTypography>
        {{ $t("mediaItem.trackingMenu.currentEpisode") }}
      </UiTypography>
      <UiSelect
        v-model="currentValue.currentEpisode"
        :width="184"
        :disabled="updateMediaItemTrackingDataApi.isPending.value"
        :options="episodeOptions"
        @update:model-value="handleChange"
      />
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 8px;

  .item {
    display: flex;
    gap: 16px;
    align-items: center;
    justify-content: space-between;
  }
}
</style>
