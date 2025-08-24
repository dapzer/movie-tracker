<script lang="ts" setup>
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { computed, useI18n } from "#imports"
import { UiMediaCard } from "~/shared/ui/UiCard"
import { UiRating } from "~/shared/ui/UiRating"
import { formatDate } from "~/shared/utils/formatDate"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"

interface MovieCardProps {
  movie: TmdbSearchResponseResultItemType
  width?: number
  fullHeight?: boolean
}

const props = defineProps<MovieCardProps>()

const localePath = useLocalePath()
const { locale } = useI18n()

const releaseDate = computed(() => {
  return formatDate(props.movie.release_date || props.movie.first_air_date, locale.value)
})
</script>

<template>
  <UiMediaCard
    :class="$style.wrapper"
    :title="movie.title || movie.name || movie.original_name"
    :description="releaseDate"
    :image-src="getProxiedImageUrl(props.movie.poster_path, 360)"
    :link-url="localePath(`/details/${movie.media_type}/${movie.id}`)"
    :width="props.width"
    :full-height="props.fullHeight"
    fallback-image-src="/defaultMoviePoster.svg"
  >
    <template #content>
      <UiRating
        :class="$style.rating"
        :value="movie.vote_average"
      />
    </template>
    <template #control>
      <slot name="control" />
    </template>
  </UiMediaCard>
</template>

<style lang="scss" module>
.wrapper {
  position: relative;

  .rating {
    position: absolute;
    top: 14px;
    left: 14px;
  }
}
</style>
