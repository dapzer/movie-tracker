<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { computed, useI18n } from "#imports"
import { ref } from "vue"
import MediaCardManagementMenuDrawer from "~/features/mediaCard/ui/managementMenu/MediaCardManagementMenuDrawer.vue"
import MediaCardRating from "~/features/mediaCard/ui/MediaCardRating.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiMediaCard } from "~/shared/ui/UiCard"
import { UiIcon } from "~/shared/ui/UiIcon"
import { formatDate } from "~/shared/utils/formatDate"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"

interface MediaCardProps {
  mediaItem: MediaItemType
  width?: number
  fullHeight?: boolean
  hideTrackingMenu?: boolean
  canEditRating?: boolean
}

const props = defineProps<MediaCardProps>()

const localePath = useLocalePath()
const { locale } = useI18n()
const isTrackingMenuOpen = ref(false)

const details = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value)
})

const createdDate = computed(() => {
  return formatDate(props.mediaItem.createdAt, locale.value)
})
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
        <MediaCardManagementMenuDrawer
          v-model="isTrackingMenuOpen"
          :media-item="props.mediaItem"
        />
      </UiButton>
    </template>
    <template
      v-if="props.canEditRating || props.mediaItem.mediaRating"
      #content
    >
      <MediaCardRating
        :class="$style.rating"
        :media-item="props.mediaItem"
        :can-edit-rating="props.canEditRating"
      />
    </template>
  </UiMediaCard>
</template>

<style lang="scss" module>
.wrapper {
  position: relative;

  &:hover {
    .rating button {
      --action-display: flex !important;
    }
  }
}

.rating {
  position: absolute;
  top: 14px;
  left: 14px;

  button {
    --action-display: none;
  }
}
</style>
