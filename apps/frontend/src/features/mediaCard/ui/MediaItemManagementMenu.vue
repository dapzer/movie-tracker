<script setup lang="ts">

import { MediaItemStatusNameEnum, type MediaItemType } from "@movie-tracker/types"
import { UiSelect } from "../../../shared/ui/UiSelect"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { UiDivider } from "../../../shared/ui/UiDivider"
import { UiButton } from "../../../shared/ui/UiButton"
import MediaCardTrackingMenu from "~/features/mediaCard/ui/MediaItemTrackingMenu.vue"
import { useDeleteMediaItemApi, useUpdateMediaItemTrackingDataApi } from "~/api/mediaItem/useMediaItemtApi"
import { toast } from "vue3-toastify"
import { UiIcon } from "../../../shared/ui/UiIcon"

interface MediaItemManagementMenuDrawerProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaItemManagementMenuDrawerProps>();
const emits = defineEmits<{
  (event: "clone"): void;
  (event: "changeMediaList"): void;
}>();
const { t } = useI18n()
const currentStatus = ref(props.mediaItem.trackingData.currentStatus)
const updateMediaItemTrackingDataApi = useUpdateMediaItemTrackingDataApi();
const deleteMediaItemApi = useDeleteMediaItemApi();

const handleChangeStatus = async () => {
  await updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      currentStatus: currentStatus.value
    }
  }).then(() => {
    toast.success(t("toasts.mediaItem.successStatusChanged"));
  }).catch(() => {
    toast.error(t("toasts.mediaItem.unsuccessfullyStatusChanged"));
  });
};

const handleDeleteMediaItem = () => {
  deleteMediaItemApi.mutateAsync(props.mediaItem.id).then(() => {
    toast.success(t("toasts.mediaItem.successRemovedFromCurrentList", {
      media: t(`details.mediaType.${props.mediaItem.mediaType}`)
    }));
  }).catch(() => {
    toast.error(t(`toasts.mediaItem.unsuccessfullyRemovedFromCurrentList${props.mediaItem.mediaType}`));
  });
};

const selectOptions = computed(() => {
  const rea = []

  for (const status in MediaItemStatusNameEnum) {
    rea.push({
      label: t(`mediaItem.status.${status}`),
      value: status
    })
  }

  return rea
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiSelect
      v-model="currentStatus"
      :options="selectOptions"
      @update:model-value="handleChangeStatus"
    />
    <UiDivider />
    <div :class="$style.actions">
      <UiButton
        :class="$style.menuItem"
        variant="text"
        @click="emits('changeMediaList')"
      >
        {{ t("mediaItem.changeMediaList.button") }}
      </UiButton>
      <UiButton
        :class="$style.menuItem"
        variant="text"
        @click="emits('clone')"
      >
        {{ t("mediaItem.createClone.button") }}
      </UiButton>
      <UiButton
        :class="$style.menuItem"
        variant="text"
        scheme="tertiary"
        @click="handleDeleteMediaItem"
      >
        {{ t("mediaItem.removeFromList") }}
        <UiIcon
          name="icon:trash"
          :class="$style.iconEnd"
          :size="18"
        />
      </UiButton>
    </div>
    <UiDivider />
    <MediaCardTrackingMenu :media-item="props.mediaItem" />
  </div>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;

  @layer external {
    .menuItem {
      width: 100%;
      @include dropdownItem;

      &:hover,
      &:focus,
      &:active {
        background: var(--c-white-05);
      }
    }
  }
}
</style>
