<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types";
import { useDeleteMediaItemApi, useUpdateMediaItemApi } from "~/composables/useMediaItemtApi";
import UiButton from "~/components/ui/UiButton.vue";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { computed } from "vue";

interface MovieCardStatusSelectorMenuProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MovieCardStatusSelectorMenuProps>();

const { mutateAsync: updateMediaItem, status: updateMediaItemStatus } = useUpdateMediaItemApi();
const { mutateAsync: deleteMediaItem, status: deleteMediaItemStatus } = useDeleteMediaItemApi();

const isLoading = computed(() => {
  return updateMediaItemStatus.value === "pending" || deleteMediaItemStatus.value === "pending";
})

const updateStatus = async (status: MediaItemStatusNameEnum) => {
  await updateMediaItem({
    mediaItemId: props.mediaItem.id,
    body: {
      ...props.mediaItem.trackingData,
      currentStatus: status,
    }
  })
}
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
  <UiButton
    :class="$style.button"
    :disabled="isLoading"
    variant="clear"
    @click="deleteMediaItem(props.mediaItem.id)"
  >
    {{ $t('mediaItem.removeFromList') }}
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
