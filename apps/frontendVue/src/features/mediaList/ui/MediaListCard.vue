<script lang="ts" setup>
import type { MediaListType } from "@movie-tracker/types";
import MediaListCardHeader from "~/features/mediaList/ui/MediaListCardHeader.vue";
import MediaListCardControls from "~/features/mediaList/ui/MediaListCardControls.vue";

interface MediaListCardProps {
  list: MediaListType;
}

const props = defineProps<MediaListCardProps>();
</script>

<template>
  <div :class="$style.wrapper">
    <MediaListCardHeader :list="props.list" />
    <MediaListCardControls :list="props.list" />
  </div>
</template>


<style lang="scss" module>
@import "~/styles/mixins";
@import "~/styles/variables";

.wrapper {
  @include card();
  max-width: 335px;

  @media screen and (max-width: $bp-md) {
    max-width: unset;
  }
}
</style>
