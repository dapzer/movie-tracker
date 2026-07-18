<script setup lang="ts">
import type { MediaReview } from "@movie-tracker/types"
import MediaReviewCardActions from "~/entities/mediaReview/ui/card/MediaReviewCardActions.vue"
import MediaReviewCardBase from "~/entities/mediaReview/ui/card/MediaReviewCardBase.vue"
import MediaReviewCardVotes from "~/entities/mediaReview/ui/card/MediaReviewCardVotes.vue"

interface MediaReviewCardProps {
  mediaReview: MediaReview
}

const props = defineProps<MediaReviewCardProps>()
</script>

<template>
  <MediaReviewCardBase
    :class="$style.wrapper"
    :media-review="props.mediaReview"
  >
    <template #footer>
      <div :class="$style.footer">
        <MediaReviewCardVotes :media-review="props.mediaReview" />
        <MediaReviewCardActions :media-review="props.mediaReview" />
      </div>
    </template>
  </MediaReviewCardBase>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  @include mobileDevice() {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}
</style>
