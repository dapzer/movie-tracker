<script lang="ts" setup>
import {
  useTmdbGetMovieCredits,
  useTmdbGetMovieDetails,
  useTmdbGetRecommendations,
  useTmdbGetVideos
} from "~/composables/useTmdbApi";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { arrayToString } from "@movie-tracker/utils";
import { computed, useI18n } from "#imports";
import UiTypography from "~/components/ui/UiTypography.vue";
import MovieDetailsHeader from "./MovieDetailsHeader.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { VideoCardWithPlayer } from "~/features/videoCardWithPlayer";
import UiListWithShowMore from "~/components/ui/UiListWithShowMore.vue";
import { PersonCard } from "~/widgets/personCard";
import { MovieCard } from "~/widgets/movieCard";

interface MovieDetailsProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum;
}

const props = defineProps<MovieDetailsProps>();
const { locale } = useI18n();

const queries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value
}));

const { data: details, isLoading: isDetailsLoading, suspense: suspenseDetails } = useTmdbGetMovieDetails(queries);
const {
  data: recommendations,
  isLoading: recommendationsIsLoading,
  suspense: suspenseRecommendations
} = useTmdbGetRecommendations(queries);
const {
  data: credits,
  isLoading: creditsIsLoading,
  isSuccess: creditsIsSuccess,
  suspense: suspenseCredits
} = useTmdbGetMovieCredits(queries);
const {
  data: videos,
  isLoading: videosIsLoading,
  isSuccess: videosIsSuccess,
  suspense: suspenseVideos
} = useTmdbGetVideos(queries);

await Promise.all([
  suspenseDetails(),
  suspenseRecommendations(),
  suspenseCredits(),
  suspenseVideos()
]);

const videosList = computed(() => {
  if (!videos.value?.results.length) {
    return [];
  }

  return [...videos.value.results].sort((a) => (a.type === "Trailer" || a.type === "Teaser" ? -1 : 1))
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <MovieDetailsHeader
      :credits="credits"
      :details="details"
      :mediaType="props.mediaType"
    />

    <section
      v-if="details?.overview"
      :class="$style.block"
    >
      <UiTypography
        as="h2"
        variant="title2"
      >
        {{ $t(`details.${props.mediaType}Description`) }}
      </UiTypography>
      <UiTypography :class="$style.overviev">
        {{ details?.overview }}
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
      v-if="credits?.cast.length"
      :class="$style.block"
    >
      <UiTypography
        as="h2"
        variant="title2"
      >
        {{ $t(`details.castTitle`) }}
      </UiTypography>
      <UiListWithShowMore
        variant="tripleColumns"
        :items="credits?.cast"
        :items-to-show="5"
        :title="$t('details.castTitle')"
      >
        <template #card="{ item: person, isFromModal }">
          <PersonCard
            :key="person.id"
            :class="{ [$style.card]: !isFromModal }"
            :is-horizontal="!isFromModal"
            :person="person"
          >
            <UiTypography v-if="person.total_episode_count">
              {{ $t('details.inNumberOfEpisodes', {episodes: person.total_episode_count}) }}
            </UiTypography>
            <UiTypography v-if="person.character || !!person?.roles?.length">
              {{ $t('details.role') }}: {{ person.character || arrayToString(person.roles, "character") }}
            </UiTypography>
          </PersonCard>
        </template>
      </UiListWithShowMore>
    </section>

    <section
      v-if="recommendations?.results.length"
      :class="$style.block"
    >
      <UiTypography
        as="h2"
        variant="title2"
      >
        {{ $t(`details.recommendationsTitle`) }}
      </UiTypography>
      <UiListWithShowMore
        variant="tripleColumns"
        :items="recommendations?.results"
        :items-to-show="5"
        :title="$t('details.recommendationsTitle')"
      >
        <template #card="{ item: movie, isFromModal }">
          <MovieCard
            :key="movie.id"
            :is-horizontal="!isFromModal"
            :is-hide-score="!isFromModal"
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
    height: 100%;
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
