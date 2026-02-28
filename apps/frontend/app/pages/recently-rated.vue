<script setup lang="ts">
import type { GetRecentlyCreatedMediaRatingsArgs } from "~/api/mediaRating/mediaRatingApiTypes"
import { useSeoMeta } from "#app"
import { useLocalePath } from "#i18n"
import { computed, useI18n } from "#imports"
import { useRouteQuery } from "@vueuse/router"
import { useMediaRatingsGetRecentlyCreatedApi } from "~/api/mediaRating/useMediaRatingApi"
import { MediaRatingCardWithHoverMenu } from "~/features/mediaRatingCardWithHoverMenu"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiMediaCardSkeleton } from "~/shared/ui/UiCard"
import { getPaginationParams } from "~/shared/utils/getPaginationParams"
import { ContentList } from "~/widgets/contentList"

const { t } = useI18n()
const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const localePath = useLocalePath()

const mediaRatingQueries = computed<GetRecentlyCreatedMediaRatingsArgs>(() => {
  return {
    ...getPaginationParams({
      itemsPerPage: 20,
      page: currentPage.value,
    }),
  }
})

const getMediaRatingsGetRecentlyCreatedApi = useMediaRatingsGetRecentlyCreatedApi(mediaRatingQueries)
await getMediaRatingsGetRecentlyCreatedApi.suspense()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("feed.recentlyRated")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("feed.recentlyRated")}`
  },
})

const items = computed(() => getMediaRatingsGetRecentlyCreatedApi.data?.value?.items || [])

const totalPages = computed(() => {
  const totalCount = getMediaRatingsGetRecentlyCreatedApi.data?.value?.totalCount || 0
  return Math.ceil(totalCount / 20)
})
</script>

<template>
  <ContentList
    v-model:current-page="currentPage"
    :title="$t('feed.recentlyRated')"
    :back-button-url="localePath('/')"
    :total-pages="totalPages"
    :get-page-href="(page) => page > 1 ? `?page=${page}` : localePath('')"
  >
    <template v-if="getMediaRatingsGetRecentlyCreatedApi.isFetching.value">
      <UiMediaCardSkeleton
        v-for="index in 20"
        :key="index"
        full-height
        :width="195"
      />
    </template>
    <template v-else-if="items?.length">
      <MediaRatingCardWithHoverMenu
        v-for="item in items"
        :key="item.id"
        :media-rating="item"
        :user="item.user!"
        full-height
        :width="195"
      />
    </template>
    <template
      v-if="!items?.length && !getMediaRatingsGetRecentlyCreatedApi.isFetching.value"
      #plainContent
    >
      <UiAttention
        title-variant="text"
        :indent="0"
        :title="$t('search.notingFound')"
      />
    </template>
  </ContentList>
</template>
