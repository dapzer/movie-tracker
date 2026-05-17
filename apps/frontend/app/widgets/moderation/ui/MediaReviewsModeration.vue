<script setup lang="ts">
import type { GetMediaReviewsListArgs } from "~/api/mediaReviews/mediaReviewsApiTypes"
import { MediaReviewStatus } from "@movie-tracker/types"
import { computed, ref } from "vue"
import { useGetMediaReviewsListApi } from "~/api/mediaReviews/useMediaReviewsApi"
import { MediaReviewCardSkeleton, MediaReviewModerationCard } from "~/entities/mediaReview"
import { UiPagination } from "~/shared/ui/UiPagination"
import { getPaginationParams } from "~/shared/utils/getPaginationParams"
import UiAttention from "../../../shared/ui/UiAttention/UiAttention.vue"

const currentPage = ref<number>(1)

const getMediaReviewsListApiArgs = computed<GetMediaReviewsListArgs>(() => {
  return {
    status: MediaReviewStatus.PENDING,
    ...getPaginationParams({
      page: currentPage.value,
      itemsPerPage: 10,
    }),
  }
})

const getMediaReviewsListApi = useGetMediaReviewsListApi(getMediaReviewsListApiArgs)
await getMediaReviewsListApi.suspense()

const data = computed(() => getMediaReviewsListApi.data.value)
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.list">
      <template v-if="!getMediaReviewsListApi.isPending.value && data?.items.length">
        <MediaReviewModerationCard
          v-for="review in data?.items || []"
          :key="review.id"
          :media-review="review"
        />
      </template>
      <template v-else-if="getMediaReviewsListApi.isPending.value">
        <MediaReviewCardSkeleton
          v-for="i in 10"
          :key="i"
        />
      </template>
      <UiAttention
        v-else
        :title="$t('mediaReviews.noReviews')"
        :indent="0"
        title-variant="subheading"
      />
    </div>
    <template v-if="data?.totalCount && data.totalCount >= 1">
      <UiPagination
        v-model="currentPage"
        :pages-on-sides="1"
        :items-per-page="20"
        :total-items="data.totalCount * getMediaReviewsListApiArgs.limit!"
      />
    </template>
  </div>
</template>

<style module lang="scss">
.wrapper {
}

.list {
  display: flex;
  flex-direction: column;
  gap: 16px;
  margin-top: 16px;
  margin-bottom: 30px;
}
</style>
