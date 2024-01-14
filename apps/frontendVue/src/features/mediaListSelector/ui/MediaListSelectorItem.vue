<script lang="ts" setup>
import { type MediaListType, MediaTypeEnum } from "@movie-tracker/types";
import { computed, ref } from "vue";
import { useCreateMediaItemApi, useDeleteMediaItemApi, useGetMediaItemsApi } from "~/composables/useMediaItemtApi";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiSwitch from "~/components/ui/UiSwitch.vue";
import { watch } from "#imports";

interface MediaListSelectorItemProps {
  mediaId: number;
  mediaType: MediaTypeEnum;
  mediaList: MediaListType;
}

const props = defineProps<MediaListSelectorItemProps>();

const { data: mediaItems } = useGetMediaItemsApi();
const { mutateAsync: createMediaItem, status: createMediaItemStatus } = useCreateMediaItemApi();
const { mutateAsync: deleteMediaItem, status: deleteMediaItemStatus } = useDeleteMediaItemApi();

const isAlreadyInList = ref(false);

const isProccessing = computed(() => {
  return createMediaItemStatus.value === "pending" || deleteMediaItemStatus.value === "pending";
});

const mediaItem = computed(() => {
  return mediaItems?.value?.find(item => item.mediaId === props.mediaId && item.mediaType === props.mediaType &&
    item.mediaListId === props.mediaList.id);
});

watch(mediaItem, () => {
  isAlreadyInList.value = !!mediaItem.value;
}, { immediate: true });

const handleMediaItemListState = () => {
  if (!!mediaItem.value) {
    deleteMediaItem(mediaItem.value.id).catch(() => {
      isAlreadyInList.value = true;
    })
  } else {
    createMediaItem({
      mediaId: props.mediaId,
      mediaType: props.mediaType,
      mediaListId: props.mediaList.id
    }).catch(() => {
      isAlreadyInList.value = false;
    })
  }
};
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      variant="title3"
      :class="$style.title"
    >
      {{ props.mediaList.title || $t("mediaList.favorites") }}
    </UiTypography>

    <UiSwitch
      v-model="isAlreadyInList"
      :is-disabled="isProccessing"
      @change="handleMediaItemListState"
    />
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
  justify-content: space-between;

  .title {
    overflow: hidden;
    text-overflow: ellipsis;
    white-space: nowrap;
  }
}
</style>
