<script lang="ts" setup>
import type { TmdbPersonCastType, TmdbPersonCrewType, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import type { UiMediaCardHorizontalSize } from "~/shared/ui/UiCard"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { computed } from "vue"
import { UiMediaCardHorizontal } from "~/shared/ui/UiCard"

import { UiTypography } from "~/shared/ui/UiTypography"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"

interface MovieCardProps {
  movie: TmdbSearchResponseResultItemType | TmdbPersonCrewType | TmdbPersonCastType
  horizontalTitle?: boolean
  width?: number
  fullHeight?: boolean
  imageWidth?: number
  size?: UiMediaCardHorizontalSize
  subDescription?: string
  withoutLink?: boolean
}

const props = defineProps<MovieCardProps>()

const slots = defineSlots()

const localePath = useLocalePath()

const linkUrl = computed(() => {
  if (props.withoutLink) {
    return undefined
  }
  return localePath(`/details/${props.movie.media_type}/${props.movie.id}`)
})
</script>

<template>
  <UiMediaCardHorizontal
    :sub-description="props.subDescription"
    :size="props.size"
    :image-src="getProxiedImageUrl(props.movie.poster_path, 360)"
    :link-url="linkUrl"
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
          :as="props.withoutLink ? 'p' : NuxtLink"
          :to="linkUrl"
        >
          {{ movie.title || movie.name || movie.original_name }}
        </UiTypography>
        <slot name="afterTitle" />
      </div>
    </template>

    <template #description>
      <slot name="description" />
    </template>
  </UiMediaCardHorizontal>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";

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
