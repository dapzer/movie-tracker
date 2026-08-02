<script setup lang="ts">
import type { FetchError } from "@movie-tracker/utils"
import { navigateTo } from "#app"
import { useLocalePath } from "#i18n"
import { createError, useI18n, useSeoMeta } from "#imports"
import { useRoute } from "#vue-router"
import { HttpStatus } from "@movie-tracker/utils"
import { computed, watch } from "vue"
import { useGetMediaReviewByIdApi } from "~/api/mediaReviews/useMediaReviewsApi"
import { MediaReviewCard } from "~/entities/mediaReview"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiInfoHeader } from "~/shared/ui/UiInfoHeader"
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"
import { getProxiedImageUrl } from "~/shared/utils/getProxiedImageUrl"
import MovieDetailsActions from "~/widgets/details/ui/MovieDetailsActions.vue"

const route = useRoute()
const reviewId = route.params.id
const { locale, t } = useI18n()
const localePath = useLocalePath()

const getMediaReviewByIdApiArgs = computed(() => {
  return {
    id: reviewId as string,
  }
})

const getMediaReviewByIdApi = useGetMediaReviewByIdApi(getMediaReviewByIdApiArgs, {
  retry: false,
  retryOnMount: false,
})
await getMediaReviewByIdApi.suspense().then((res) => {
  const statusCode = (res.error as FetchError)?.statusCode

  if (statusCode === HttpStatus.NOT_FOUND || statusCode === HttpStatus.BAD_REQUEST) {
    throw createError({
      status: 404,
      message: t("ui.errors.pageNotFound"),
    })
  }
})

const review = computed(() => {
  return getMediaReviewByIdApi.data.value
})

const details = computed(() => {
  return getCurrentMediaDetails(review.value?.mediaDetails, locale.value)
})

const title = computed(() => {
  return `${t("mediaReview.pageTitle")} | ${details.value?.title || details.value?.originalTitle} | ${t(`details.mediaType.${review.value?.mediaType}`)}`
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${title.value} | ${titleChunk} `
  },
  ogTitle() {
    return `%s | ${title.value}`
  },
})

const moviePagePath = computed(() => {
  return localePath(`/details/${review.value?.mediaType}/${review.value?.mediaId}`)
})

watch(() => review.value, (newValue, oldValue) => {
  if (!newValue && oldValue) {
    navigateTo(localePath(`/details/${oldValue.mediaType}/${oldValue.mediaId}`))
  }
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiInfoHeader
      poster-size="small"
      :description="$t(`details.mediaType.${review?.mediaType}`)"
      :image="details?.poster && getProxiedImageUrl(details?.poster, 350)"
      fallback-image="/defaultMoviePoster.svg"
      :title="details?.title || details?.originalTitle!"
      :back-button-text="$t(`details.backTo${review?.mediaType === 'movie' ? 'Movie' : 'Tv'}Page`)"
      :back-button-url="moviePagePath"
    >
      <template
        v-if="review"
        #posterFooter
      >
        <MovieDetailsActions
          hide-rating
          :class="$style.actionsMobile"
          :title="details?.title || details?.originalTitle"
          :media-id="review.mediaId"
          :media-type="review.mediaType"
          :release-date="review.mediaDetails?.releaseDate"
        />
      </template>
      <template
        v-if="review"
        #content
      >
        <MovieDetailsActions
          hide-rating
          :class="$style.actionsPc"
          :title="details?.title || details?.originalTitle"
          :media-id="review.mediaId"
          :media-type="review.mediaType"
          :release-date="review.mediaDetails?.releaseDate"
        />
      </template>
    </UiInfoHeader>
    <UiDivider :class="$style.divider" />
    <MediaReviewCard
      v-if="review"
      :media-review="review"
      hide-review-page-link
    />
  </UiContainer>
</template>

<style module lang="scss">
@use "~/shared/styles/breakpoints" as *;
@use "~/shared/styles/mixins" as *;

.wrapper {
  padding-top: 50px;

  @include mobileDevice() {
    padding-top: 0;
  }
}

.divider {
  margin-top: 20px;
  margin-bottom: 16px;

  @include mobileDevice() {
    display: none;
  }
}

.actionsMobile {
  display: none;

  @include mobilePlusDevice() {
    display: flex;

    &,
    button,
    > * {
      width: 100%;
    }
  }
}

.actionsPc {
  margin-top: auto;
  flex-direction: row;
  gap: 8px;

  button {
    margin: 0;
  }

  @include mobilePlusDevice() {
    display: none;
  }
}
</style>
