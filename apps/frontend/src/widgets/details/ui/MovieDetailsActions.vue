<script setup lang="ts">

import { MediaListSelectorModal } from "~/entities/mediaList"
import { MediaTypeEnum, TmdbMediaTypeEnum } from "@movie-tracker/types"

interface MovieDetailsActionsProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum | MediaTypeEnum;
}

const props = defineProps<MovieDetailsActionsProps>();
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
@import "~/styles/newVariables";
@import "~/styles/mixins";
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
