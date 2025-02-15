<script setup lang="ts">

import { formatDate } from "~/utils/formatDate"
import { UiDelimiter } from "../../../shared/ui/UiDelimiter"
import { MovieCardHorizontal } from "~/entities/movieCard"
import { UiTypography } from "../../../shared/ui/UiTypography"
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"

interface SearchResultMovieCardHorizontalProps {
  movie: TmdbSearchResponseResultItemType;
}

const props = defineProps<SearchResultMovieCardHorizontalProps>();
const { locale } = useI18n();
</script>

<template>
  <MovieCardHorizontal
    :movie="props.movie"
    :image-width="60"
    horizontal-title
  >
    <template #description>
      <div :class="$style.description">
        <UiTypography variant="description">
          {{ $t(`details.mediaType.${props.movie.media_type}`) }}
        </UiTypography>
        <template v-if="props.movie.release_date || props.movie.first_air_date">
          <UiDelimiter />

          <UiTypography variant="description">
            {{ formatDate(props.movie.release_date || props.movie.first_air_date, locale) }}
          </UiTypography>
        </template>
      </div>
    </template>
  </MovieCardHorizontal>
</template>

<style module lang="scss">
.description {
  display: flex;
  align-items: center;
  gap: 8px;
}
</style>
