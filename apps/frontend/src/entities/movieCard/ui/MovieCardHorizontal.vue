<script lang="ts" setup>
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types";
import { getProxiedImageUrl } from "#imports";
import { useLocalePath } from "#i18n";
import { UiMediaCardHorizontal, type UiMediaCardHorizontalSize } from "~/components/newUi/UiCard"
import { UiTypography } from "~/components/newUi/UiTypography"
import { UiRating } from "~/components/newUi/UiRating"

interface MovieCardProps {
  movie: TmdbSearchResponseResultItemType;
  width?: number;
  fullHeight?: boolean;
  imageWidth?: number;
  size?: UiMediaCardHorizontalSize;
  subDescription?: string;
}

const props = defineProps<MovieCardProps>();

const localePath = useLocalePath();

const slots = defineSlots()
</script>

<template>
  <UiMediaCardHorizontal
    :sub-description="props.subDescription"
    :size="props.size"
    :image-src="getProxiedImageUrl(props.movie.poster_path, 360)"
    :link-url="localePath(`/details/${movie.media_type}/${movie.id}`)"
    :width="props.width"
    :image-width="props.imageWidth"
    :full-height="props.fullHeight"
    fallback-image-src="/defaultMoviePoster.svg"
  >
    <template
      v-if="slots.precontent"
      #precontent
    >
      <slot name="precontent" />`
    </template>

    <template #title>
      <div :class="$style.titleWrapper">
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
        >
          {{ movie.title || movie.name || movie.original_name }}
        </UiTypography>
        <UiRating
          :value="movie.vote_average"
        />
      </div>
    </template>

    <template #description>
      <slot name="description" />
    </template>
  </UiMediaCardHorizontal>
</template>

<style lang="scss" module>
@import "~/styles/mixins";
@import "~/styles/newVariables";

.titleWrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title {
    @include multiLineEllipsis(2);
  }
}
</style>
