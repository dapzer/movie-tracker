<script setup lang="ts">
import type { MediaRatingType, MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { MediaRatingSelectForm } from "~/entities/mediaRating"
import { useIsMobile } from "~/shared/composables/useIsMobile"
import { UiBottomDrawer } from "~/shared/ui/UiBottomDrawer"
import { UiModal } from "~/shared/ui/UiModal"

interface MediaRatingSelectModalProps {
  currentRating?: MediaRatingType
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  title: string
}

const props = defineProps<MediaRatingSelectModalProps>()
const model = defineModel<boolean>()

const { isMobile } = useIsMobile()

function openModal() {
  model.value = true
}
</script>

<template>
  <slot
    name="trigger"
    :open-modal="openModal"
  />
  <ClientOnly>
    <UiModal
      v-if="!isMobile"
      v-model="model"
      without-header
      :max-width="456"
    >
      <template #content="{ closeModal }">
        <MediaRatingSelectForm
          :title="props.title"
          :current-rating="props.currentRating"
          :media-id="props.mediaId"
          :media-type="props.mediaType"
          @after-submit="closeModal"
        />
      </template>
    </UiModal>
    <UiBottomDrawer
      v-else
      v-model="model"
    >
      <template #content="{ closeModal }">
        <MediaRatingSelectForm
          :title="props.title"
          :current-rating="props.currentRating"
          :media-id="props.mediaId"
          :media-type="props.mediaType"
          @after-submit="closeModal"
        />
      </template>
    </UiBottomDrawer>
  </ClientOnly>
</template>

<style scoped lang="scss">

</style>
