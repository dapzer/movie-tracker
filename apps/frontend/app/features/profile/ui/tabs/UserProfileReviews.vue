<script setup lang="ts">
import type { GetMediaReviewsByUserIdArgs } from "~/api/mediaReviews/mediaReviewsApiTypes"
import { computed, onBeforeUnmount } from "#imports"
import { MediaReviewStatus } from "@movie-tracker/types"
import { useRouteQuery } from "@vueuse/router"
import { useGetMediaReviewsByUserIdApi } from "~/api/mediaReviews/useMediaReviewsApi"
import { MediaReviewCardSkeleton, MediaReviewCardWithPoster } from "~/entities/mediaReview"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiPagination } from "~/shared/ui/UiPagination"
import { getPaginationParams } from "~/shared/utils/getPaginationParams"

interface UserProfileReviewsProps {
  userId: string
}

const props = defineProps<UserProfileReviewsProps>()
const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})

const itemsPerPage = 10

const mediaReviewsQueries = computed<GetMediaReviewsByUserIdArgs>(() => {
  return {
    userId: props.userId,
    status: MediaReviewStatus.PUBLISHED,
    ...(getPaginationParams({
      itemsPerPage,
      page: currentPage.value,
    })),
  }
})

const getMediaReviewsByUserIdApi = useGetMediaReviewsByUserIdApi(mediaReviewsQueries)
await getMediaReviewsByUserIdApi.suspense()

onBeforeUnmount(() => {
  currentPage.value = 1
})

const mediaReviews = computed(() => {
  return getMediaReviewsByUserIdApi.data.value?.items || []
})
</script>

<template>
  <UiAttention
    v-if="!mediaReviews.length && !getMediaReviewsByUserIdApi.isLoading.value"
    :title="$t('userProfile.noReviews')"
  />
  <template v-else>
    <div :class="$style.list">
      <template v-if="!getMediaReviewsByUserIdApi.isLoading.value">
        <MediaReviewCardWithPoster
          v-for="review in mediaReviews"
          :key="review.id"
          :media-review="review"
        />
      </template>
      <template v-else>
        <MediaReviewCardSkeleton
          v-for="i in itemsPerPage"
          :key="i"
        />
      </template>
    </div>
    <UiPagination
      v-if="getMediaReviewsByUserIdApi.data.value?.totalCount"
      v-model="currentPage"
      :pages-on-sides="1"
      :items-per-page="itemsPerPage"
      :total-items="getMediaReviewsByUserIdApi.data.value.totalCount"
    />
  </template>
</template>

<style module lang="scss">
.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-bottom: 24px;
}
</style>
