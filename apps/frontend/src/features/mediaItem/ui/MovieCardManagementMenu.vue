<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { useDeleteMediaItemApi, useUpdateMediaItemTrackingDataApi } from "~/composables/useMediaItemtApi";
import UiButton from "~/components/ui/UiButton.vue";
import { computed } from "vue";
import { toast } from "vue3-toastify";
import { useI18n } from "#imports";
import UiDivider from "~/components/ui/UiDivider.vue";
import { MediaItemChangeMediaListModal, MediaItemCreateCopyModal } from "~/features/mediaItem";

interface MovieCardManagementMenuProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MovieCardManagementMenuProps>();

const updateMediaItemTrackingDataApi = useUpdateMediaItemTrackingDataApi();
const deleteMediaItemApi = useDeleteMediaItemApi();

const isLoading = computed(() => {
  return updateMediaItemTrackingDataApi.status.value === "pending" || deleteMediaItemApi.status.value === "pending";
});

const { t } = useI18n();

const updateStatus = (status: MediaItemStatusNameEnum) => {
  updateMediaItemTrackingDataApi.mutateAsync({
    trackingDataId: props.mediaItem.trackingData.id,
    body: {
      ...props.mediaItem.trackingData,
      currentStatus: status
    }
  }).then(() => {
    toast.success(t("toasts.mediaItem.successStatusChanged"));
  });
};

const handleDeleteMediaItem = () => {
  deleteMediaItemApi.mutateAsync(props.mediaItem.id).then(() => {
    toast.success(t("toasts.mediaItem.successRemovedFromCurrentList", {
      media: t(`details.mediaType.${props.mediaItem.mediaType}`)
    }));
  });
};
</script>

<template>
  <template
    v-for="status in MediaItemStatusNameEnum"
    :key="status"
  >
    <UiButton
      :class="$style.button"
      :disabled="isLoading || status === props.mediaItem.trackingData.currentStatus"
      variant="clear"

      @click="updateStatus(status)"
    >
      {{ $t(`mediaItem.status.${status}`) }}
    </UiButton>
  </template>

  <UiDivider />

  <MediaItemChangeMediaListModal :media-item="props.mediaItem" />

  <MediaItemCreateCopyModal
    :media-details="props.mediaItem.mediaDetails"
    :media-id="props.mediaItem.mediaId"
    :media-item-id="props.mediaItem.id"
    :media-type="props.mediaItem.mediaType"
  />

  <UiDivider />

  <UiButton
    :class="$style.button"
    :disabled="isLoading"
    variant="clear"
    @click="handleDeleteMediaItem"
  >
    {{ $t("mediaItem.removeFromList") }}
  </UiButton>
</template>

<style lang="scss" module>
.button {
  width: 100%;
  font-size: 1em;
  font-weight: var(--fw-regular);
  font-family: Arial Roboto, sans-serif;

  &:last-of-type {
    color: var(--c-danger);

    &:hover {
      color: var(--c-danger-hovered);
    }
  }
}
</style>
