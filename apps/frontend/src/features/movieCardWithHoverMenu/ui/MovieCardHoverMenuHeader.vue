<script setup lang="ts">

import { getFormatedNumber } from "~/utils/getFormatedNumber"
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { computed } from "#imports"
import { getColorByRating } from "~/utils/getColorByRating"
import { UiTypography } from "~/components/newUi/UiTypography"
import { StarIcon } from "~/components/ui/icons"
import { UiTag } from "~/components/newUi/UiTag"

interface MovieCardHoverMenuHeaderProps {
  movie: TmdbSearchResponseResultItemType;
}

const props = defineProps<MovieCardHoverMenuHeaderProps>();

const currentRatingColor = computed(() => {
  return getColorByRating(props.movie.vote_average);
});
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.title">
      <UiTypography variant="subheading">
        {{ props.movie.title || props.movie.name || props.movie.original_name }}
      </UiTypography>

      <div :class="$style.subtitle">
        <div
          :class="[$style.rating, {
            [$style.red]: currentRatingColor === 'red',
            [$style.orange]: currentRatingColor === 'orange',
            [$style.green]: currentRatingColor === 'green'
          }]"
        >
          <StarIcon />
          <UiTypography
            variant="labelSmall"
          >
            {{ Number(props.movie.vote_average.toFixed(1)) }}
          </UiTypography>
        </div>

        <UiTypography
          :class="$style.voteCount"
          variant="badge"
        >
          ({{ getFormatedNumber(props.movie.vote_count, 1) }} {{ $t('details.scores').toLowerCase() }})
        </UiTypography>
      </div>
    </div>

    <div
      v-if="props.movie.genre_ids.length"
      :class="$style.genres"
    >
      <UiTag
        v-for="genreId in props.movie.genre_ids"
        :key="genreId"
      >
        {{ $t(`details.genres.${props.movie.media_type}.${genreId}`) }}
      </UiTag>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .title {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }

  .rating,
  .subtitle {
    display: flex;
    gap: 2px;
    align-items: flex-end;

    .voteCount {
      color: var(--c-white-60);
    }
  }

  .rating {
    align-items: center;
    height: fit-content;

    &.green {
      color: var(--c-green-2);
    }

    &.orange {
      color: var(--c-orange-2);
    }

    &.red {
      color: var(--c-red);
    }

    p {
      color: inherit;
    }
  }

  .genres {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }
}
</style>
