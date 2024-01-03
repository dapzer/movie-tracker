<script lang="ts" setup>
import {
  useTmdbGetMovieCredits,
  useTmdbGetMovieDetails,
  useTmdbGetRecommendations,
  useTmdbGetVideos
} from "~/composables/useTmdbApi";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { computed, useI18n } from "#imports";
import UiTypography from "~/components/ui/UiTypography.vue";
import MovieDetailsHeader from "~/features/details/ui/MovieDetailsHeader.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { VideoCardWithPlayer } from "~/features/videoCardWithPlayer";
import UiListWithShowMore from "~/components/ui/UiListWithShowMore.vue";

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
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

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
