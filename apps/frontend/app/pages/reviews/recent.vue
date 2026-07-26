<script setup lang="ts">
import type { GetMediaReviewsListArgs } from "~/api/mediaReviews/mediaReviewsApiTypes"
import { useLocalePath } from "#i18n"
import { computed, useI18n, useSeoMeta } from "#imports"
import { useRouteQuery } from "@vueuse/router"
import { useGetMediaReviewsListApi } from "~/api/mediaReviews/useMediaReviewsApi"
import { MediaReviewCardBase, MediaReviewCardMediaNameLink, MediaReviewCardSkeleton } from "~/entities/mediaReview"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiPagination } from "~/shared/ui/UiPagination"
import { getPaginationParams } from "~/shared/utils/getPaginationParams"
import { ContentListHeader } from "~/widgets/contentList"

const { t } = useI18n()
const localePath = useLocalePath()
const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})

const mediaReviewsQueries = computed<GetMediaReviewsListArgs>(() => {
  return getPaginationParams({
    itemsPerPage: 10,
    page: currentPage.value,
  })
})

const getMediaReviewsListApi = useGetMediaReviewsListApi(mediaReviewsQueries)
await getMediaReviewsListApi.suspense()

const data = computed(() => {
  return getMediaReviewsListApi.data.value
})

const title = computed(() => {
  return t("feed.recentReviews")
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${title.value} | ${titleChunk} `
  },
  ogTitle() {
    return `%s | ${title.value}`
  },
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <ContentListHeader
      :title="$t('feed.recentReviews')"
      :back-button-url="localePath('/')"
    />
    <div :class="$style.list">
      <template v-if="!getMediaReviewsListApi.isPending.value && data?.items.length">
        <MediaReviewCardBase
          v-for="review in data?.items || []"
          :key="review.id"
          :media-review="review"
        >
          <template #footer>
            <MediaReviewCardMediaNameLink :review="review" />
          </template>
        </MediaReviewCardBase>
      </template>
      <template v-else-if="getMediaReviewsListApi.isPending.value">
        <MediaReviewCardSkeleton
          v-for="i in 10"
          :key="i"
        />
      </template>
      <template v-else>
        <UiAttention
          title-variant="text"
          :indent="0"
          :title="$t('search.notingFound')"
        />
      </template>
    </div>
    <template v-if="data?.totalCount && data.totalCount >= 1">
      <UiPagination
        v-model="currentPage"
        :pages-on-sides="1"
        :items-per-page="mediaReviewsQueries.limit!"
        :total-items="data.totalCount"
        :get-page-href="(page) => page > 1 ? `?page=${page}` : localePath('')"
      />
    </template>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  padding-top: 24px !important;
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 30px;
}
</style>
