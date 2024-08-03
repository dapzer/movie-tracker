<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types";
import { MediaItemStatusNameEnum } from "@movie-tracker/types";
import { computed, ref } from "vue";
import UiDetails from "~/components/ui/UiDetails.vue";
import MasonryWall from "@yeger/vue-masonry-wall";
import MediaItemCard from "~/features/mediaItem/ui/card/MediaItemCard.vue";
import { nextTick, watch } from "#imports";

interface MediaItemsStatusedCategoryProps {
  items: MediaItemType[];
  status: MediaItemStatusNameEnum;
  isListOwner?: boolean;
  title?: string;
  isOpenedDefault?: boolean;
}

const props = defineProps<MediaItemsStatusedCategoryProps>();
const emits = defineEmits<{
  (e: "handleCategoryState", category: MediaItemStatusNameEnum, value: boolean): void
}>();
const mediaItems = computed(() => {
  return props.items.filter(item => item.trackingData.currentStatus === props.status);
});

const proxyArray = ref<MediaItemType[]>([]);

// * Fix for avoid full masonry wall rendering while update media item - https://github.com/DerYeger/yeger/tree/main/packages/vue-masonry-wall#adding-items
watch(mediaItems, async (newValue) => {
  await nextTick();
  if (proxyArray.value.length !== newValue.length) {
    proxyArray.value = mediaItems.value;
  } else {
    for (let i = 0; i < newValue.length; i++) {
      proxyArray.value[i] = newValue[i];
    }
  }
}, { immediate: true });
</script>

<template>
  <UiDetails
    v-if="mediaItems.length"
    :is-opened-default="props.isOpenedDefault"
    :title="$t(`mediaItem.status.${status}`)"
    is-large
    @on-handle-state="emits('handleCategoryState', status, $event)"
  >
    <!-- @vue-skip -->
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
