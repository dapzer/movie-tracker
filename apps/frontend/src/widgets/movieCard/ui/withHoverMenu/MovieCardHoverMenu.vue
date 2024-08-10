<script setup lang="ts">
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { UiTypography } from "~/components/newUi/UiTypography"
import { ListIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/newUi/UiButton"
import MovieCardHoverMenuHeader from "~/widgets/movieCard/ui/withHoverMenu/MovieCardHoverMenuHeader.vue"

interface MovieCardHoverMenuProps {
  movie: TmdbSearchResponseResultItemType;
}

const props = defineProps<MovieCardHoverMenuProps>();
</script>

<template>
  <div :class="$style.wrapper">
    <MovieCardHoverMenuHeader :movie="props.movie" />

    <div v-if="props.movie.overview">
      <UiTypography
        :class="$style.overview"
        variant="description"
      >
        {{ props.movie.overview }}
      </UiTypography>
    </div>

    <div>
      <UiButton
        :class="$style.addToListButton"
        variant="outlined"
        scheme="secondary"
      >
        <ListIcon />
        {{ $t('mediaList.addToList') }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 300px;

  .overview {
    @include multiLineEllipsis(3);
  }

  .addToListButton {
    display: flex;
    align-items: center;
    gap: 2px;
    font-size: var(--fs-label-small);
  }
}
</style>
