<script setup lang="ts">
import type { TmdbMediaTypeEnum, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { MovieCard } from "~/entities/movieCard"
import { MovieHoverMenu } from "~/entities/movieHoverMenu"

interface MovieCardWithHoverMenuProps {
  fullHeight?: boolean
  movie: TmdbSearchResponseResultItemType
  width?: number
}

const props = defineProps<MovieCardWithHoverMenuProps>()
</script>

<template>
  <MovieCard
    :full-height="props.fullHeight"
    v-bind="$attrs"
    :movie="props.movie"
  >
    <template #control>
      <MovieHoverMenu
        :media-id="props.movie.id"
        :media-type="props.movie.media_type as TmdbMediaTypeEnum"
      />
    </template>
  </MovieCard>
</template>

<style module lang="scss">
</style>
