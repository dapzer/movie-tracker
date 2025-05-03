<script setup lang="ts">
import type { MediaRatingType, MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { MediaRatingSelectForm } from "~/entities/mediaRating"
import { UiModal } from "~/shared/ui/UiModal"

interface MediaRatingSelectModalProps {
  currentRating?: MediaRatingType
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  title: string
}

const props = defineProps<MediaRatingSelectModalProps>()
const model = defineModel<boolean>()
</script>

<template>
  <UiModal
    v-model="model"
    without-header
    :max-width="436"
  >
    <template #trigger="{ openModal }">
      <slot
        name="trigger"
        :open-modal="openModal"
      />
    </template>
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
</template>

<style scoped lang="scss">

</style>
