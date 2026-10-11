<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import MediaCardManagementMenuActions
  from "~/features/mediaCard/ui/managementMenu/overview/MediaCardManagementMenuActions.vue"
import MediaCardManagementMenuItem
  from "~/features/mediaCard/ui/managementMenu/overview/MediaCardManagementMenuItem.vue"
import MediaCardManagementMenuNote
  from "~/features/mediaCard/ui/managementMenu/overview/MediaCardManagementMenuNote.vue"
import MediaCardManagementMenuSitesToView
  from "~/features/mediaCard/ui/managementMenu/overview/MediaCardManagementMenuSitesToView.vue"
import MediaCardManagementMenuStatus
  from "~/features/mediaCard/ui/managementMenu/overview/MediaCardManagementMenuStatus.vue"
import { UiDivider } from "~/shared/ui/UiDivider"

interface MediaItemManagementMenuDrawerProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaItemManagementMenuDrawerProps>()
const emits = defineEmits<{
  (event: "clone"): void
  (event: "changeMediaList"): void
}>()
const { t } = useI18n()
</script>

<template>
  <div :class="$style.wrapper">
    <MediaCardManagementMenuItem :title="t('mediaItem.managementMenu.currentStatus')">
      <MediaCardManagementMenuStatus
        :tracking-data="props.mediaItem.trackingData"
        :current-status="props.mediaItem.trackingData.currentStatus"
      />
    </MediaCardManagementMenuItem>
    <UiDivider />
    <MediaCardManagementMenuItem :title="t('mediaItem.managementMenu.actions')">
      <MediaCardManagementMenuActions
        :media-item-id="props.mediaItem.id"
        :media-type="props.mediaItem.mediaType"
        @clone="emits('clone')"
        @change-media-list="emits('changeMediaList')"
      />
    </MediaCardManagementMenuItem>
    <UiDivider />
    <MediaCardManagementMenuItem :title="t('mediaItem.managementMenu.sitesToView')">
      <MediaCardManagementMenuSitesToView :media-item="props.mediaItem" />
    </MediaCardManagementMenuItem>
    <UiDivider />
    <MediaCardManagementMenuItem :title="t('mediaItem.managementMenu.note')">
      <MediaCardManagementMenuNote :media-item="props.mediaItem" />
    </MediaCardManagementMenuItem>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;
  width: 100%;
}
</style>
