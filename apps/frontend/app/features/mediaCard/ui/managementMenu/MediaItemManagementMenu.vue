<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { computed, ref } from "vue"
import { useGetTrackingDataByMediaItemIdApi } from "~/api/trackingData/useTrackingDataApi"
import MediaItemManagementMenuTabs
  from "~/features/mediaCard/ui/managementMenu/MediaItemManagementMenuTabs.vue"
import MediaCardManagementMenuOverview
  from "~/features/mediaCard/ui/managementMenu/overview/MediaCardManagementMenuOverview.vue"
import MediaCardManagementMenuOverviewSkeleton
  from "~/features/mediaCard/ui/managementMenu/overview/MediaCardManagementMenuOverviewSkeleton.vue"
import MediaCardManagementMenuTvProgress
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgress.vue"

interface MediaItemManagementMenuDrawerProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaItemManagementMenuDrawerProps>()
const emits = defineEmits<{
  (event: "clone"): void
  (event: "changeMediaList"): void
}>()
const { t } = useI18n()
const activeTab = ref<"management" | "progress">("management")

const getTrackingDataByMediaItemIdApi = useGetTrackingDataByMediaItemIdApi({
  mediaItemId: props.mediaItem.id,
})

const trackingData = computed(() => getTrackingDataByMediaItemIdApi.data.value)
</script>

<template>
  <MediaCardManagementMenuOverviewSkeleton
    v-if="getTrackingDataByMediaItemIdApi.isLoading.value && props.mediaItem.mediaType === MediaTypeEnum.MOVIE"
  />
  <MediaCardManagementMenuOverview
    v-else-if="trackingData && props.mediaItem.mediaType === MediaTypeEnum.MOVIE"
    :media-item="props.mediaItem"
    :tracking-data="trackingData"
    @clone="emits('clone')"
    @change-media-list="emits('changeMediaList')"
  />
  <MediaItemManagementMenuTabs
    v-else
    v-model="activeTab"
    :tabs="[
      {
        key: 'management',
        label: t('mediaItem.managementMenu.tabs.management'),
      },
      {
        key: 'progress',
        label: t('mediaItem.managementMenu.tabs.progress'),
      },
    ]"
  >
    <template #management>
      <MediaCardManagementMenuOverviewSkeleton v-if="getTrackingDataByMediaItemIdApi.isLoading.value" />
      <MediaCardManagementMenuOverview
        v-else-if="trackingData"
        :media-item="props.mediaItem"
        :tracking-data="trackingData"
        @clone="emits('clone')"
        @change-media-list="emits('changeMediaList')"
      />
    </template>
    <template #progress>
      <MediaCardManagementMenuTvProgress
        :media-details="props.mediaItem.mediaDetails!"
        :media-item-id="props.mediaItem.id"
      />
    </template>
  </MediaItemManagementMenuTabs>
</template>
