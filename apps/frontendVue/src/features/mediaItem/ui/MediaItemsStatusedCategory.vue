<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { computed } from "vue";
import UiDetails from "~/components/ui/UiDetails.vue";
import MasonryWall from "@yeger/vue-masonry-wall";
import MediaItemCard from "~/features/mediaItem/ui/card/MediaItemCard.vue";

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
</script>

<template>
  <UiDetails
    v-if="mediaItems.length"
    is-large
    is-opened-default
    :title="$t(`mediaItem.status.${status}`)"
  >
    <MasonryWall
      :column-width="300"
      :gap="20"
      :items="mediaItems"
      :max-columns="4"
    >
      <template #default="{ item }">
        <MediaItemCard
          :key="item.id"
          :is-hide-controls="!isListOwner"
          :media-item="item"
        />
      </template>
    </MasonryWall>
  </UiDetails>
</template>

<style lang="scss" module>

</style>
