<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { MediaListSelectorModal } from "~/entities/mediaList"
import MediaDetailsRatingSelector from "~/widgets/details/ui/MediaDetailsRatingSelector.vue"

interface MovieDetailsActionsProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
  hideRating?: boolean
  title?: string
}

const props = defineProps<MovieDetailsActionsProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <MediaListSelectorModal
      :media-id="props.mediaId"
      :media-type="props.mediaType"
    />
    <MediaDetailsRatingSelector
      v-if="!props.hideRating"
      :title="props.title"
      :media-id="props.mediaId"
      :media-type="props.mediaType"
    />
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/variables";
@import "~/shared/styles/mixins";

.wrapper {
  height: fit-content;
  display: flex;
  align-items: flex-start;
  justify-content: flex-start;
  flex-direction: column;

  button:not(:last-child) {
    margin-bottom: 8px;
  }

  @include mobileDevice() {
    &,
    button {
      width: 100%;
    }
  }
}
</style>
