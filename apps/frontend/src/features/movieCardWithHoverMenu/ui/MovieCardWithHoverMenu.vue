<script setup lang="ts">

import { UiHoverCard } from "~/components/newUi/UiHoverCard"
import { MovieCard } from "~/entities/movieCard"
import { TmdbMediaTypeEnum, type TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import MovieCardHoverMenu from "~/features/movieCardWithHoverMenu/ui/MovieCardHoverMenu.vue"
import { DetailsIcon } from "~/components/ui/icons"

interface MovieCardWithHoverMenuProps {
  fullHeight?: boolean;
  movie: TmdbSearchResponseResultItemType;
  width?: number;
}

const props = defineProps<MovieCardWithHoverMenuProps>();
</script>

<template>
  <MovieCard
    :full-height="props.fullHeight"
    v-bind="$attrs"
    :movie="props.movie"
  >
    <template #control>
      <UiHoverCard
        :indent="0"
        :class="$style.trigger"
        align="start"
        side="right"
      >
        <template #trigger>
          <DetailsIcon />
        </template>

        <template #content>
          <MovieCardHoverMenu
            :media-type="props.movie.media_type as TmdbMediaTypeEnum"
            :media-id="props.movie.id"
          />
        </template>
      </UiHoverCard>
    </template>
  </MovieCard>
</template>

<style module lang="scss">
.trigger {
  cursor: pointer;
  position: absolute;
  top: 8px;
  width: fit-content;
  right: 16px;
  z-index: 1;

  svg {
    margin-top: 8px;
  }

  &:not(:hover) {
    opacity: 0.5;
  }
}
</style>
