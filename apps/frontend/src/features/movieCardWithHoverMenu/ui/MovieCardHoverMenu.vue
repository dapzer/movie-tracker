<script setup lang="ts">
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { UiTypography } from "~/components/newUi/UiTypography"
import { ListIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/newUi/UiButton"
import MovieCardHoverMenuHeader from "~/features/movieCardWithHoverMenu/ui/MovieCardHoverMenuHeader.vue"
import { computed, useI18n } from "#imports"
import { useGetTmdbMovieCreditsApi, useGetTmdbMovieDetailsApi } from "~/api/tmdb/useTmdbApi"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { getMovieDirectors } from "@movie-tracker/utils"
import MovieCardHoverMenuSkeleton from "~/features/movieCardWithHoverMenu/ui/MovieCardHoverMenuSkeleton.vue"

interface MovieCardHoverMenuProps {
  mediaType: TmdbMediaTypeEnum;
  mediaId: number;
}

const props = defineProps<MovieCardHoverMenuProps>();
const { locale } = useI18n();
const localePath = useLocalePath()

const queries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value
}));

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries);
const tmdbGetMovieCreditsApi = useGetTmdbMovieCreditsApi(queries);

const producers = computed(() => {
  if (!tmdbGetMovieCreditsApi.data.value?.crew) return [];
  return getMovieDirectors(tmdbGetMovieCreditsApi.data.value?.crew );
});
</script>

<template>
  <div :class="$style.wrapper">
    <MovieCardHoverMenuSkeleton v-if="tmdbGetMovieCreditsApi.isLoading.value || tmdbGetMovieDetailsApi.isLoading.value" />

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

width: 300px;

  .directedBy {
    a {
      color: var(--c-text);
      text-decoration: underline;
    }
  }

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
