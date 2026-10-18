<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { MediaTypeEnum } from "@movie-tracker/types"
import { ref } from "vue"
import MediaCardManagementMenuOverview
  from "~/features/mediaCard/ui/managementMenu/overview/MediaCardManagementMenuOverview.vue"
import MediaCardManagementMenuTvProgress
  from "~/features/mediaCard/ui/managementMenu/tvProgress/MediaCardManagementMenuTvProgress.vue"
import { UiTabs } from "~/shared/ui/UiTabs"

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
</script>

<template>
  <MediaCardManagementMenuOverview
    v-if="props.mediaItem.mediaType === MediaTypeEnum.MOVIE"
    :media-item="props.mediaItem"
    @clone="emits('clone')"
    @change-media-list="emits('changeMediaList')"
  />
  <UiTabs
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
      <MediaCardManagementMenuOverview
        :media-item="props.mediaItem"
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
  </UiTabs>
</template>

<style module lang="scss">

</style>
