<script lang="ts" setup>
import {
  useGetTmdbMovieCreditsApi,
  useGetTmdbMovieDetailsApi,
  useGetTmdbRecommendationsApi,
  useGetTmdbVideosApi
} from "~/api/tmdb/useTmdbApi";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { computed, createError, useI18n } from "#imports";
import UiTypography from "~/components/ui/UiTypography.vue";
import MovieDetailsHeader from "./MovieDetailsHeader.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { VideoCardWithPlayer } from "~/features/videoCardWithPlayer";
import UiListWithShowMore from "~/components/ui/UiListWithShowMore.vue";
import { PersonCard } from "~/widgets/personCard";
import { MovieCard } from "~/widgets/movieCard";
import { arrayToString } from "@movie-tracker/utils";
import { useLocalePath } from "#i18n";
import { useMovieDetailsSeo } from "~/features/details/model/useMovieDetailsSeo";

interface MovieDetailsProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum;
}

const props = defineProps<MovieDetailsProps>();
const { locale, t } = useI18n();

const queries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value
}));

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries);
const tmdbGetRecommendationsApi = useGetTmdbRecommendationsApi(queries);
const tmdbGetMovieCreditsApi = useGetTmdbMovieCreditsApi(queries);
const tmdbGetVideosApi = useGetTmdbVideosApi(queries);

await Promise.all([
  tmdbGetMovieDetailsApi.suspense().then((res) => {
    if (res.data === null) {
      throw createError({
        statusCode: 404,
        message: t("ui.errors.pageNotFound"),
      });
    }
  }),
  tmdbGetRecommendationsApi.suspense(),
  tmdbGetMovieCreditsApi.suspense(),
  tmdbGetVideosApi.suspense()
]);

useMovieDetailsSeo(props.mediaId, props.mediaType, tmdbGetMovieDetailsApi.data.value, tmdbGetMovieCreditsApi.data.value);

const videosList = computed(() => {
  if (!tmdbGetVideosApi.data.value?.results.length) {
    return [];
  }

  return [...tmdbGetVideosApi.data.value.results].sort((a) => (a.type === "Trailer" || a.type === "Teaser" ? -1 : 1));
});
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <MovieDetailsHeader
      :credits="tmdbGetMovieCreditsApi.data.value"
      :details="tmdbGetMovieDetailsApi.data.value"
      :mediaType="props.mediaType"
    />

    <section
      v-if="tmdbGetMovieDetailsApi.data.value?.overview"
      :class="$style.block"
    >
      <UiTypography
        as="h2"
        variant="title2"
      >
        {{ $t(`details.${props.mediaType}Description`) }}
      </UiTypography>
      <UiTypography :class="$style.overviev">
        {{ tmdbGetMovieDetailsApi.data.value?.overview }}
      </UiTypography>
    </section>

    <section
      v-if="videosList.length"
      :class="$style.block"
    >
      <UiTypography
        as="h2"
        variant="title2"
      >
        {{ $t(`details.videosTitle`) }}
      </UiTypography>
      <UiListWithShowMore
        :items="videosList"
        :items-to-show="3"
        :title="$t('details.videosTitle')"
      >
        <template #card="{ item: video }">
          <VideoCardWithPlayer
            :key="video.id"
            :description="`${$t('details.releaseDate')}: ${new Date(video.published_at).toLocaleDateString(locale)}`"
            :preview-url="`https://i.ytimg.com/vi/${video.key}/hq720.jpg`"
            :title="video.name"
            :video-url="`https://www.youtube.com/embed/${video.key}?autoplay=1`"
          />
        </template>
      </UiListWithShowMore>
    </section>

    <section
      v-if="tmdbGetMovieCreditsApi.data.value?.cast.length"
      :class="$style.block"
    >
      <UiTypography
        as="h2"
        variant="title2"
      >
        {{ $t(`details.castTitle`) }}
      </UiTypography>
      <UiListWithShowMore
        :items="tmdbGetMovieCreditsApi.data.value?.cast"
        :items-to-show="5"
        :title="$t('details.castTitle')"
        variant="tripleColumns"
      >
        <template #card="{ item: person, isFromModal }">
          <PersonCard
            :key="person.id"
            :class="{ [$style.card]: !isFromModal }"
            :is-horizontal="!isFromModal"
            :person="person"
          >
            <template
              v-if="person.total_episode_count || person.character || !!person?.roles?.length"
              #default
            >
              <UiTypography v-if="person.total_episode_count">
                {{ $t("details.inNumberOfEpisodes", { episodes: person.total_episode_count }) }}
              </UiTypography>
              <UiTypography v-if="person.character || !!person?.roles?.length">
                {{ $t("details.role") }}: {{ person.character || arrayToString(person.roles, "character") }}
              </UiTypography>
            </template>
          </PersonCard>
        </template>
      </UiListWithShowMore>
    </section>

    <section
      v-if="tmdbGetRecommendationsApi.data.value?.results.length"
      :class="$style.block"
    >
      <UiTypography
        as="h2"
        variant="title2"
      >
        {{ $t(`details.recommendationsTitle`) }}
      </UiTypography>
      <UiListWithShowMore
        :items="tmdbGetRecommendationsApi.data.value?.results"
        :items-to-show="5"
        :title="$t('details.recommendationsTitle')"
        variant="tripleColumns"
      >
        <template #card="{ item: movie, isFromModal }">
          <MovieCard
            :key="movie.id"
            :class="{ [$style.card]: !isFromModal }"
            :is-hide-media-list-selector="!isFromModal"
            :is-hide-score="!isFromModal"
            :is-horizontal="!isFromModal"
            :movie="movie"
          />
        </template>
      </UiListWithShowMore>
    </section>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .card {
    height: 100% !important;
  }

  .block {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }

  .overview {
    white-space: pre-wrap;
  }
}
</style>
