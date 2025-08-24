<script setup lang="ts">
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import PersonCardHorizontal from "~/entities/personCard/ui/PersonCardHorizontal.vue"
import { UiTag } from "~/shared/ui/UiTag"

interface SearchResultMovieCardHorizontalProps {
  person: TmdbSearchResponseResultItemType
}

const props = defineProps<SearchResultMovieCardHorizontalProps>()
</script>

<template>
  <PersonCardHorizontal
    without-link
    :person="props.person"
    :image-width="60"
  >
    <template #afterTitle>
      <UiTag
        color="blue"
        variant="boxed"
      >
        {{ $t(`details.mediaType.${props.person.media_type}`) }}
      </UiTag>
    </template>
  </PersonCardHorizontal>
</template>

<style module lang="scss">
</style>
