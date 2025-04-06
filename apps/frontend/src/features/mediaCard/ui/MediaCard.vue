<script lang="ts" setup>
import type { MediaItemType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { computed, useI18n } from "#imports"
import { ref } from "vue"
import MediaCardTrackingMenuDrawer from "~/features/mediaCard/ui/MediaCardManagementMenuDrawer.vue"
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
