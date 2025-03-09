<script lang="ts" setup>
import type { TmdbPersonCastType, TmdbPersonCrewType, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import type { UiMediaCardHorizontalSize } from "~/shared/ui/UiCard"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { getProxiedImageUrl } from "#imports"
import { UiMediaCardHorizontal } from "~/shared/ui/UiCard"
import { UiRating } from "~/shared/ui/UiRating"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MovieCardProps {
  movie: TmdbSearchResponseResultItemType | TmdbPersonCrewType | TmdbPersonCastType
  horizontalTitle?: boolean
  width?: number
  fullHeight?: boolean
  imageWidth?: number
  size?: UiMediaCardHorizontalSize
  subDescription?: string
}

const props = defineProps<MovieCardProps>()

const slots = defineSlots()

const localePath = useLocalePath()
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
      <slot name="precontent" />
    </template>

    <template #title>
      <div
        :class="[$style.titleWrapper, {
          [$style.horizontal]: props.horizontalTitle,
        }]"
      >
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
          :as="NuxtLink"
          :to="localePath(`/details/${movie.media_type}/${movie.id}`)"
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
@import "~/styles/variables";

.titleWrapper {
  display: flex;
  flex-direction: column;
  gap: 4px;

  &.horizontal {
    flex-direction: row;
    justify-content: space-between;
    gap: 12px;
  }

  .title {
    @include multiLineEllipsis(2);
  }
}
</style>
