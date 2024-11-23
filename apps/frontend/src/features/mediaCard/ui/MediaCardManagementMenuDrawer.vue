<script setup lang="ts">
import { getCurrentMediaDetails, useI18n, useIsMobile, useSwitchModals } from "#imports"
import MediaCardTrackingMenu from "~/features/mediaCard/ui/MediaItemManagementMenu.vue"
import { UiBottomDrawer } from "~/components/newUi/UiBottomDrawer"
import type { MediaItemType } from "@movie-tracker/types"
import { UiModal } from "~/components/newUi/UiModal"
import { computed, ref } from "vue"
import MediaItemCreateCloneModal from "~/features/mediaCard/ui/createCloneModal/MediaItemCreateCloneModal.vue"
import MediaItemChangeMediaListModal
  from "~/features/mediaCard/ui/changeMediaListModal/MediaItemChangeMediaListModal.vue"

interface MediaCardManagementMenuDrawerProps {
  mediaItem: MediaItemType;
}

const props = defineProps<MediaCardManagementMenuDrawerProps>();
const model = defineModel<boolean>()
const isOpenCloneModal = ref(false);
const isOpenChangeMediaListModal = ref(false);
const { isMobile } = useIsMobile()
const { locale, t } = useI18n();

const { onOpenSecondModal: handleOpenCloneModal } = useSwitchModals(model, isOpenCloneModal);
const { onOpenSecondModal: handleOpenChangeMediaListModal } = useSwitchModals(model, isOpenChangeMediaListModal);

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
        <MediaCardTrackingMenu
          :media-item="props.mediaItem"
          @clone="handleOpenCloneModal"
          @change-media-list="handleOpenChangeMediaListModal"
        />
      </template>
    </UiModal>
    <UiBottomDrawer
      v-else
      v-model="model"
      :title="`${$t('mediaItem.management')} ‘${currentMediaDetails?.title || currentMediaDetails?.originalTitle}’`"
    >
      <template #content>
        <MediaCardTrackingMenu
          :media-item="props.mediaItem"
          @clone="handleOpenCloneModal"
          @change-media-list="handleOpenChangeMediaListModal"
        />
      </template>
    </UiBottomDrawer>

    <MediaItemCreateCloneModal
      v-model="isOpenCloneModal"
      :media-item="props.mediaItem"
    />
    <MediaItemChangeMediaListModal
      v-model="isOpenChangeMediaListModal"
      :media-item="props.mediaItem"
    />
  </ClientOnly>
</template>

<style scoped lang="scss">

</style>
