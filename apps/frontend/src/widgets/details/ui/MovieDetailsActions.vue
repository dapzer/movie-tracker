<script setup lang="ts">
import type { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { MediaListSelectorModal } from "~/entities/mediaList"

interface MovieDetailsActionsProps {
  mediaId: number
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum
}

const props = defineProps<MovieDetailsActionsProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <MediaListSelectorModal
      :media-id="props.mediaId"
      :media-type="props.mediaType"
    />
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/variables";
@import "~/shared/styles/mixins";
.wrapper {
  display: flex;
  justify-content: flex-start;
  gap: 8px;

  @include mobileDevice() {
    &,
    button {
      width: 100%;
    }
  }
}
</style>
