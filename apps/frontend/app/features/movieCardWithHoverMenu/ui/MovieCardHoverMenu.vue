<script setup lang="ts">
import type { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { computed, useI18n } from "#imports"
import { getMovieDirectors } from "@movie-tracker/utils"
import { useGetTmdbMovieCreditsApi, useGetTmdbMovieDetailsApi } from "~/api/tmdb/useTmdbApi"
import MovieCardHoverMenuHeader from "~/features/movieCardWithHoverMenu/ui/MovieCardHoverMenuHeader.vue"
import MovieCardHoverMenuSkeleton from "~/features/movieCardWithHoverMenu/ui/MovieCardHoverMenuSkeleton.vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

interface MovieCardHoverMenuProps {
  mediaType: TmdbMediaTypeEnum
  mediaId: number
}

const props = defineProps<MovieCardHoverMenuProps>()
const emits = defineEmits<{
  (event: "onAddToListClick"): void
}>()
const { locale } = useI18n()
const localePath = useLocalePath()

const queries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value,
}))
const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries)
const tmdbGetMovieCreditsApi = useGetTmdbMovieCreditsApi(queries)

const producers = computed(() => {
  if (!tmdbGetMovieCreditsApi.data.value?.crew)
    return []
  return getMovieDirectors(tmdbGetMovieCreditsApi.data.value?.crew)
})
</script>

<template>
  <div :class="$style.wrapper">
    <MovieCardHoverMenuSkeleton
      v-if="tmdbGetMovieCreditsApi.isLoading.value || tmdbGetMovieDetailsApi.isLoading.value"
    />

    <template v-else>
      <MovieCardHoverMenuHeader
        v-if="tmdbGetMovieDetailsApi.data.value"
        :movie="tmdbGetMovieDetailsApi.data.value"
        :media-type="props.mediaType"
      />

      <div v-if="producers.length">
        <UiTypography
          :class="$style.directedBy"
          variant="description"
        >
          {{ $t('details.directedBy') }}
          <template
            v-for="(producer, index) in producers"
            :key="producer.id"
          >
            <UiTypography
              variant="description"
              :as="NuxtLink"
              schema="link"
              :to="localePath(`/details/person/${producer.id}`)"
            >
              {{ producer.name }}
            </UiTypography>
            {{ index !== producers.length - 1 ? ', ' : '' }}
          </template>
        </UiTypography>
      </div>

      <div v-if="tmdbGetMovieDetailsApi.data.value?.overview">
        <UiTypography
          :class="$style.overview"
          variant="description"
        >
          {{ tmdbGetMovieDetailsApi.data.value?.overview }}
        </UiTypography>
      </div>
    </template>

    <div>
      <UiButton
        :class="$style.addToListButton"
        with-icon
        variant="outlined"
        scheme="secondary"
        @click="emits('onAddToListClick')"
      >
        <UiIcon
          name="icon:list"
          :size="16"
        />
        {{ $t('mediaList.addToList') }}
      </UiButton>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  width: 300px;

  .directedBy {
    a {
      text-decoration: underline;

      &:not(:hover, :active, :focus) {
        color: var(--c-text);
      }
    }
  }

  .overview {
    @include multiLineEllipsis(3);
  }

  .addToListButton {
    font-size: var(--fs-label-small);
  }
}
</style>
