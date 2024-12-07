<script setup lang="ts">

import { type TmdbMediaDetailsType, TmdbMediaTypeEnum } from "@movie-tracker/types"
import { UiTypography } from "~/components/ui/UiTypography"
import { UiTag } from "~/components/ui/UiTag"
import { UiVoteWithRuntime } from "~/components/ui/UiVoteWithRuntime"

interface MovieCardHoverMenuHeaderProps {
  movie: TmdbMediaDetailsType;
  mediaType: TmdbMediaTypeEnum;
}

const props = defineProps<MovieCardHoverMenuHeaderProps>();
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.title">
      <UiTypography variant="subheading">
        {{ props.movie.title || props.movie.name || props.movie.original_name }}
      </UiTypography>

      <UiVoteWithRuntime
        :vote-average="props.movie.vote_average"
        :vote-count="props.movie.vote_count"
        :runtime="props.movie.runtime"
      />
    </div>

    <div
      v-if="props.movie.genres.length"
      :class="$style.genres"
    >
      <UiTag
        v-for="genre in props.movie.genres"
        :key="genre.id"
      >
        {{ $t(`details.genres.${props.mediaType}.${genre.id}`) }}
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

  .genres {
    display: flex;
    flex-wrap: wrap;
    gap: 2px;
  }
}
</style>
