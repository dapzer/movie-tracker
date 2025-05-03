<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import MediaItemChangeMediaListModal
  from "~/features/mediaCard/ui/changeMediaListModal/MediaItemChangeMediaListModal.vue"
import MediaItemCreateCloneModal from "~/features/mediaCard/ui/createCloneModal/MediaItemCreateCloneModal.vue"
import MediaCardTrackingMenu from "~/features/mediaCard/ui/managementMenu/MediaItemManagementMenu.vue"
import { useIsMobile } from "~/shared/composables/useIsMobile"
import { useSwitchModals } from "~/shared/composables/useSwitchModals"
import { UiBottomDrawer } from "~/shared/ui/UiBottomDrawer"
import { UiModal } from "~/shared/ui/UiModal"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"

interface MediaCardManagementMenuDrawerProps {
  mediaItem: MediaItemType
}

const props = defineProps<MediaCardManagementMenuDrawerProps>()
const model = defineModel<boolean>()
const isOpenCloneModal = ref(false)
const isOpenChangeMediaListModal = ref(false)
const { isMobile } = useIsMobile()
const { locale } = useI18n()

const { onOpenSecondModal: handleOpenCloneModal } = useSwitchModals(model, isOpenCloneModal)
const { onOpenSecondModal: handleOpenChangeMediaListModal } = useSwitchModals(model, isOpenChangeMediaListModal)

const currentMediaDetails = computed(() => {
  return getCurrentMediaDetails(props.mediaItem.mediaDetails, locale.value)
})
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
