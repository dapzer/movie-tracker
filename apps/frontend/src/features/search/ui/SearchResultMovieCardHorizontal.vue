<script setup lang="ts">
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { computed } from "vue"
import { MovieCardHorizontal } from "~/entities/movieCard"
import { UiDelimiter } from "~/shared/ui/UiDelimiter"
import { UiRating } from "~/shared/ui/UiRating"
import { UiTag } from "~/shared/ui/UiTag"
import { UiTypography } from "~/shared/ui/UiTypography"
import { formatDate } from "~/shared/utils/formatDate"

interface SearchResultMovieCardHorizontalProps {
  movie: TmdbSearchResponseResultItemType
}

const props = defineProps<SearchResultMovieCardHorizontalProps>()
const { locale, t } = useI18n()

const genres = computed(() => {
  return props.movie.genre_ids.map(id => t(`details.genres.${props.movie.media_type}.${id}`).toLowerCase())
})
</script>

<template>
  <MovieCardHorizontal
    without-link
    :movie="props.movie"
    :image-width="60"
    horizontal-title
  >
    <template #afterTitle>
      <UiTag
        color="blue"
        variant="boxed"
      >
        {{ $t(`details.mediaType.${props.movie.media_type}`) }}
      </UiTag>
    </template>
    <template #description>
      <div :class="$style.description">
        <UiRating
          :value="props.movie.vote_average"
        />

        <template v-if="props.movie.release_date || props.movie.first_air_date">
          <UiTypography
            :class="$style.releaseDate"
            variant="description"
          >
            {{ formatDate(props.movie.release_date || props.movie.first_air_date, locale) }}
          </UiTypography>
        </template>

        <template v-if="genres.length">
          <UiDelimiter />

          <UiTypography
            ellipsis
            variant="description"
            :class="$style.genres"
          >
            {{ genres.join(", ") }}
          </UiTypography>
        </template>
      </div>
    </template>
  </MovieCardHorizontal>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.description {
  display: flex;
  align-items: center;
  gap: 8px;
}

.releaseDate {
  white-space: nowrap;
}

.genres::first-letter {
  text-transform: uppercase;
}
</style>
