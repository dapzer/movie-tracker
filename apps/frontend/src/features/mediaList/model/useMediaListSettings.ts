import { computed, ref } from "vue";
import type { MediaListSortingOptionType } from "~/features/mediaList";
import { mediaListSortingOptions } from "~/features/mediaList";
import { watch } from "#imports";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { useLocalStorage } from "@vueuse/core";
import { useGetMediaListsApi } from "~/api/mediaList/useMediaListApi";

export interface MediaListSettingsType {
  sortModel: MediaListSortingOptionType;
  categoriesState: Record<MediaItemStatusNameEnum, boolean>;
}

const initialSettings: MediaListSettingsType = {
  sortModel: mediaListSortingOptions[0],
  categoriesState: {
    [MediaItemStatusNameEnum.WATCHING_NOW]: true,
    [MediaItemStatusNameEnum.NOT_VIEWED]: true,
    [MediaItemStatusNameEnum.WAIT_NEW_PART]: true,
    [MediaItemStatusNameEnum.VIEWED]: true
  }
};

export const useMediaListSettings = (humanFriendlyId: string) => {
  const currentMedaListSettings = ref<MediaListSettingsType>(initialSettings);
  const storedMediaListSettings = useLocalStorage<MediaListSettingsType>("medaListSettings", initialSettings);
  const mediaListsApi = useGetMediaListsApi();

  const isUserListOwner = computed(() => {
    return mediaListsApi.data.value?.some(list => list.humanFriendlyId === humanFriendlyId);
  });

  watch(isUserListOwner, () => {
    if (isUserListOwner.value) {
      currentMedaListSettings.value = storedMediaListSettings.value;
    } else {
      currentMedaListSettings.value = initialSettings;
    }
  }, { immediate: true });

  watch(currentMedaListSettings, () => {
    if (isUserListOwner.value) {
      storedMediaListSettings.value = currentMedaListSettings.value;
    }
  }, { deep: true });

  const handleCategoryState = (category: MediaItemStatusNameEnum, value: boolean) => {
    currentMedaListSettings.value.categoriesState[category] = value;
  }

  return {
    currentMedaListSettings,
    handleCategoryState
  };
};
