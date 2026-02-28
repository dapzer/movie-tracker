<script setup lang="ts">
import type { MediaRatingCardProps } from "~/entities/mediaRating"
import { MediaRatingCard } from "~/entities/mediaRating"
import { MovieHoverMenu } from "~/entities/movieHoverMenu"

interface MovieCardWithHoverMenuProps extends MediaRatingCardProps {}

const props = defineProps<MovieCardWithHoverMenuProps>()
</script>

<template>
  <MediaRatingCard
    :full-height="props.fullHeight"
    :media-rating="props.mediaRating"
    :user="props.user"
    :width="props.width"
  >
    <template #control>
      <MovieHoverMenu
        :media-id="props.mediaRating.mediaId"
        :media-type="props.mediaRating.mediaType"
      />
    </template>
  </MediaRatingCard>
</template>
