<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { computed, ref } from "vue";
import UiDetails from "~/components/ui/UiDetails.vue";
import MasonryWall from "@yeger/vue-masonry-wall";
import MediaItemCard from "~/features/mediaItem/ui/card/MediaItemCard.vue";
import { watch } from "#imports";
import { mediaItemMutationStore } from "~/stores/mediaItemMutationStore";

interface MediaItemsStatusedCategoryProps {
  items: MediaItemType[];
  status: MediaItemStatusNameEnum;
  isListOwner?: boolean;
  title?: string;
}

const props = defineProps<MediaItemsStatusedCategoryProps>();

const mediaItems = computed(() => {
  return props.items.filter(item => item.trackingData.currentStatus === props.status);
});

const proxyArray = ref<MediaItemType[]>([]);

// * Fix for avoid full masonry wall rendering while update media item - https://github.com/DerYeger/yeger/tree/main/packages/vue-masonry-wall#adding-items
watch(mediaItems, async (newValue) => {
  if (proxyArray.value.length !== newValue.length) {
    proxyArray.value = mediaItems.value;
  } else  {
    await new Promise(resolve => {
      setTimeout(resolve, 0);
    });

    if (mediaItemMutationStore.state.lastMutatedItemId) {
      const index = newValue.findIndex(item => mediaItemMutationStore.state.lastMutatedItemId === item.id);

      if (index !== -1) {
        proxyArray.value[index] = mediaItems.value[index];
        mediaItemMutationStore.handleLastEditedItemId("");
      }
    }
  }
}, { immediate: true });
</script>

<template>
  <UiDetails
    v-if="mediaItems.length"
    :title="$t(`mediaItem.status.${status}`)"
    is-large
    is-opened-default
  >
    <MasonryWall
      :column-width="300"
      :gap="20"
      :items="proxyArray"
      :keyMapper="item => item.id"
      :max-columns="4"
    >
      <template #default="{ item }">
        <MediaItemCard
          :is-hide-controls="!isListOwner"
          :media-item="item"
        />
      </template>
    </MasonryWall>
  </UiDetails>
</template>

<style lang="scss" module>

</style>
