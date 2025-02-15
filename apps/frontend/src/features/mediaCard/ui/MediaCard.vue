<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types";
import { computed, getCurrentMediaDetails, getProxiedImageUrl, useI18n } from "#imports";
import { useLocalePath } from "#i18n";
import { UiMediaCard } from "~/components/ui/UiCard"
import { formatDate } from "~/utils/formatDate"
import { UiButton } from "~/components/ui/UiButton"
import { ref } from "vue"
import MediaCardTrackingMenuDrawer from "~/features/mediaCard/ui/MediaCardManagementMenuDrawer.vue"
import { UiIcon } from "~/components/ui/UiIcon"

interface MediaCardProps {
  mediaItem: MediaItemType;
  width?: number;
  fullHeight?: boolean;
  hideTrackingMenu?: boolean;
}

const props = defineProps<MediaCardProps>();

const localePath = useLocalePath();
const { locale } = useI18n();
const isTrackingMenuOpen = ref(false);

const details = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value)
})

const createdDate = computed(() => {
  return formatDate(props.mediaItem.createdAt, locale.value);
});
</script>

<template>
  <UiMediaCard
    :class="$style.wrapper"
    :title="(details?.title || details?.originalTitle)!"
    :description="createdDate"
    :image-src="getProxiedImageUrl(details?.poster, 360)"
    :link-url="localePath(`/details/${props.mediaItem.mediaType}/${props.mediaItem.mediaId}`)"
    :width="props.width"
    :full-height="props.fullHeight"
    fallback-image-src="/defaultMoviePoster.svg"
  >
    <template
      v-if="!props.hideTrackingMenu"
      #control
    >
      <UiButton
        variant="textIcon"
        @click="isTrackingMenuOpen = true"
      >
        <UiIcon
          name="icon:management"
          :size="20"
        />
        <MediaCardTrackingMenuDrawer
          v-model="isTrackingMenuOpen"
          :media-item="props.mediaItem"
        />
      </UiButton>
    </template>
  </UiMediaCard>
</template>

<style lang="scss" module>
.wrapper {
  position: relative;
}
</style>
