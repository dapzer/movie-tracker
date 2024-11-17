<script setup lang="ts">
import { getCurrentMediaDetails, useI18n, useIsMobile } from "#imports"
import MediaCardTrackingMenu from "~/features/mediaCard/ui/MediaItemManagementMenu.vue"
import { UiBottomDrawer } from "~/components/newUi/UiBottomDrawer"
import type { MediaItemType } from "@movie-tracker/types"
import { UiModal } from "~/components/newUi/UiModal"
import { computed } from "vue"

interface MediaCardManagementMenuDrawerProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaCardManagementMenuDrawerProps>();
const model = defineModel<boolean>()
const { isMobile } = useIsMobile()
const { locale, t } = useI18n();

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value);
});
</script>

<template>
  <ClientOnly>
    <UiModal
      v-if="!isMobile"
      v-model="model"
      :title="`${$t('mediaItem.management')} ‘${currentMediaDetails?.title || currentMediaDetails?.originalTitle}’`"
      :max-width="495"
    >
      <template #content>
        <MediaCardTrackingMenu :media-item="props.mediaItem" />
      </template>
    </UiModal>
    <UiBottomDrawer
      v-else
      v-model="model"
      :title="`${$t('mediaItem.management')} ‘${currentMediaDetails?.title || currentMediaDetails?.originalTitle}’`"
    >
      <template #content>
        <MediaCardTrackingMenu :media-item="props.mediaItem" />
      </template>
    </UiBottomDrawer>
  </ClientOnly>
</template>

<style scoped lang="scss">

</style>
