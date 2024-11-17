<script setup lang="ts">
import { useI18n, useIsMobile } from "#imports"
import { UiDropdown } from "~/components/newUi/UiDropdown"
import MediaCardTrackingMenu from "~/features/mediaCard/ui/MediaItemManagementMenu.vue"
import { UiBottomDrawer } from "~/components/newUi/UiBottomDrawer"
import type { MediaItemType } from "@movie-tracker/types"

interface MediaCardManagementMenuDrawerProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaCardManagementMenuDrawerProps>();
const model = defineModel<boolean>()
const { locale } = useI18n();
const { isMobile } = useIsMobile()
</script>

<template>
  <ClientOnly>
    <UiDropdown
      v-if="!isMobile"
      v-model="model"
      side="bottom"
    >
      <template #content>
        <MediaCardTrackingMenu :media-item="props.mediaItem" />
      </template>
    </UiDropdown>
    <UiBottomDrawer
      v-else
      v-model="model"
      title="Manage ‘Rick and Morty’"
    >
      <template #content>
        <MediaCardTrackingMenu :media-item="props.mediaItem" />
      </template>
    </UiBottomDrawer>
  </ClientOnly>
</template>

<style scoped lang="scss">

</style>
