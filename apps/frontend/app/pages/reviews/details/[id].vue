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
import { getCurrentMediaDetails } from "~/shared/utils/getCurrentMediaDetails"
import { ContentListHeader } from "~/widgets/contentList"

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
  return `${t("mediaReview.pageTitle")} | ${details.value?.title} | ${t(`details.mediaType.${review.value?.mediaType}`)}`
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
    <ContentListHeader
      :title="t('mediaReview.reviewOf', { title: details?.title })"
      :back-button-text="details?.title "
      :back-button-url="moviePagePath"
    />

    <MediaReviewCard
      v-if="review"
      :media-review="review"
    />
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  padding-top: 44px !important;
}
</style>
