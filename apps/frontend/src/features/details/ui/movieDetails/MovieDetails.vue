<script lang="ts" setup>
import {
  useGetTmdbMovieCreditsApi,
  useGetTmdbMovieDetailsApi,
  useGetTmdbRecommendationsApi,
  useGetTmdbVideosApi
} from "~/api/tmdb/useTmdbApi";
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { computed, createError, getProxiedImageUrl, useI18n } from "#imports";
import MovieDetailsHeader from "./MovieDetailsHeader.vue";
import UiContainer from "~/components/ui/UiContainer.vue";
import { VideoCardWithPlayer } from "~/widgets/videoCardWithPlayer";
import { useMovieDetailsSeo } from "~/features/details/model/useMovieDetailsSeo";
import { UiSectionWithSeeMore } from "~/components/newUi/UiSectionWithSeeMore"
import { UiSlider } from "~/components/newUi/UiSlider"
import { LanguagesEnum } from "~/types/languagesEnum"
import { arrayToString } from "@movie-tracker/utils"
import { PersonWithDescription } from "~/widgets/personWithDescription"
import { useLocalePath } from "#i18n"

interface MovieDetailsProps {
  mediaId: number;
  mediaType: TmdbMediaTypeEnum;
}

const props = defineProps<MovieDetailsProps>();
const { locale, t } = useI18n();
const localePath = useLocalePath();

const queries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value
}));

const getVideosQueries = computed(() => ({
  mediaType: props.mediaType,
  mediaId: props.mediaId,
  language: locale.value,
  includeVideoLanguage: locale.value === LanguagesEnum.RU ? [LanguagesEnum.EN, LanguagesEnum.RU].join(",") : undefined
}));

const tmdbGetMovieDetailsApi = useGetTmdbMovieDetailsApi(queries);
const tmdbGetRecommendationsApi = useGetTmdbRecommendationsApi(queries);
const tmdbGetMovieCreditsApi = useGetTmdbMovieCreditsApi(queries);
const tmdbGetVideosApi = useGetTmdbVideosApi(getVideosQueries);

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

useMovieDetailsSeo({
  credits: tmdbGetMovieCreditsApi.data.value,
  mediaId: props.mediaId,
  mediaType: props.mediaType,
  media: tmdbGetMovieDetailsApi.data.value,
});

const videosList = computed(() => {
  if (!tmdbGetVideosApi.data.value?.results.length) {
    return [];
  }

  return [...tmdbGetVideosApi.data.value.results].sort((a) => (a.type === "Trailer" || a.type === "Teaser" ? -1 : 1));
});

const castList = computed(() => {
  if (!tmdbGetMovieCreditsApi.data.value?.cast.length) {
    return [];
  }

  return tmdbGetMovieCreditsApi.data.value.cast.slice(0, 12);
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <MovieDetailsHeader
      :credits="tmdbGetMovieCreditsApi.data.value"
      :details="tmdbGetMovieDetailsApi.data.value"
      :mediaType="props.mediaType"
      :overview="tmdbGetMovieDetailsApi.data.value?.overview"
    />

    <UiSectionWithSeeMore
      v-if="videosList.length"
      :title="$t(`details.videosTitle`)"
      hide-see-more
    >
      <UiSlider
        :data="videosList"
        :max-width="295"
      >
        <template #slide="{item}">
          <VideoCardWithPlayer
            full-height
            :title="item.name"
            :description="`${$t('details.releaseDate')}: ${new Date(item.published_at).toLocaleDateString(locale)}`"
            :preview-src="`https://i.ytimg.com/vi/${item.key}/hq720.jpg`"
            :video-url="`https://www.youtube.com/embed/${item.key}?autoplay=1`"
          />
        </template>
      </UiSlider>
    </UiSectionWithSeeMore>

    <UiSectionWithSeeMore
      v-if="castList.length"
      :title="$t(`details.castTitle`)"
      :see-more-url="localePath(`/details/${props.mediaType}/${props.mediaId}/cast`)"
    >
      <div :class="$style.castList">
        <PersonWithDescription
          v-for="person in castList"
          :key="person.id"
          :class="$style.castItem"
          :name="person.name"
          :description="person.character || arrayToString(person.roles, 'character')"
          :person-page-url="localePath(`/details/${TmdbMediaTypeEnum.PERSON}/${person.id}`)"
          :image-src="getProxiedImageUrl(person.profile_path, 260)"
        />
      </div>
    </UiSectionWithSeeMore>

    <!--    <section-->
    <!--      v-if="tmdbGetRecommendationsApi.data.value?.results.length"-->
    <!--      :class="$style.block"-->
    <!--    >-->
    <!--      <UiTypography-->
    <!--        as="h2"-->
    <!--        variant="title2"-->
    <!--      >-->
    <!--        {{ $t(`details.recommendationsTitle`) }}-->
    <!--      </UiTypography>-->
    <!--      <UiListWithShowMore-->
    <!--        :items="tmdbGetRecommendationsApi.data.value?.results"-->
    <!--        :items-to-show="5"-->
    <!--        :title="$t('details.recommendationsTitle')"-->
    <!--        variant="tripleColumns"-->
    <!--      >-->
    <!--        <template #card="{ item: movie, isFromModal }">-->
    <!--          <MovieCard-->
    <!--            :key="movie.id"-->
    <!--            :class="{ [$style.card]: !isFromModal }"-->
    <!--            :is-hide-media-list-selector="!isFromModal"-->
    <!--            :is-hide-score="!isFromModal"-->
    <!--            :is-horizontal="!isFromModal"-->
    <!--            :movie="movie"-->
    <!--          />-->
    <!--        </template>-->
    <!--      </UiListWithShowMore>-->
    <!--    </section>-->
  </UiContainer>
</template>

<style lang="scss" module>
@import "~/styles/newVariables";
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 70px;
  padding-top: 50px !important;

  @include mobileDevice() {
    padding-top: 24px !important;
  }

  .castList {
    display: grid;
    grid-template-columns: repeat(4, 1fr);
    row-gap: 40px;
    column-gap: 72px;
    width: 100%;

    @include tabletDevice() {
      grid-template-columns: repeat(3, 1fr);
      column-gap: 48px;
      row-gap: 30px;

      .castItem:nth-child(n+10) {
        display: none;
      }
    }

    @include mobileDevice() {
      grid-template-columns: repeat(1, 1fr);
      column-gap: 48px;
      row-gap: 30px;

      .castItem:nth-child(n+7) {
        display: none;
      }
    }
  }

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
