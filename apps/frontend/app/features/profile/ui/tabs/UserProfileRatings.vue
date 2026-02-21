<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import type { FetchError } from "@movie-tracker/utils"
import type { GetMediaRatingByUserIdArgs } from "~/api/mediaRating/mediaRatingApiTypes"
import { onBeforeUnmount, onServerPrefetch } from "#imports"
import { HttpStatus } from "@movie-tracker/utils"
import { useRouteQuery } from "@vueuse/router"
import { computed } from "vue"
import { useGetMediaRatingByUserIdApi } from "~/api/mediaRating/useMediaRatingApi"
import MediaRatingCard from "~/entities/mediaRating/ui/MediaRatingCard.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiMediaCardSkeleton } from "~/shared/ui/UiCard"
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"
import { UiPagination } from "~/shared/ui/UiPagination"

interface UserProfileRatingsProps {
  user: UserPublicType
  ratingsCount?: number
}

const props = defineProps<UserProfileRatingsProps>()
const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})

const getMediaRatingByUserIdArgs = computed<GetMediaRatingByUserIdArgs>(() => {
  return {
    userId: props.user.id,
    limit: 20,
    offset: (currentPage.value - 1) * 20,
  }
})

const getMediaRatingByUserIdApi = useGetMediaRatingByUserIdApi(getMediaRatingByUserIdArgs)

onServerPrefetch(async () => {
  await getMediaRatingByUserIdApi.suspense()
})

onBeforeUnmount(() => {
  currentPage.value = 1
})

const mediaItems = computed(() => {
  if (!getMediaRatingByUserIdApi.data.value?.items) {
    return []
  }
  return getMediaRatingByUserIdApi.data.value.items
})

const isPrivate = computed(() => {
  return (getMediaRatingByUserIdApi.error.value as FetchError)?.statusCode === HttpStatus.FORBIDDEN
})

const loadingSkeletonCount = computed(() => {
  return props.ratingsCount ? Math.min(props.ratingsCount, 20) : 0
})
</script>

<template>
  <UiAttention
    v-if="isPrivate"
    :title="$t('userProfile.privateRatings')"
  />
  <UiAttention
    v-else-if="(!mediaItems.length && !getMediaRatingByUserIdApi.isLoading.value) || !props.ratingsCount"
    :title="$t('userProfile.noRatings')"
  />
  <template v-else>
    <UiCardsGrid>
      <template v-if="!getMediaRatingByUserIdApi.isLoading.value">
        <MediaRatingCard
          v-for="movie in mediaItems"
          :key="movie.id"
          :media-rating="movie"
          :user="props.user"
          full-height
          hide-tracking-menu
        />
      </template>
      <template v-else>
        <UiMediaCardSkeleton
          v-for="i in loadingSkeletonCount"
          :key="i"
          loading-skeleton
          full-height
          hide-tracking-menu
        />
      </template>
    </UiCardsGrid>
    <UiPagination
      v-if="getMediaRatingByUserIdApi.data.value?.totalCount"
      v-model="currentPage"
      :class="$style.pagination"
      :pages-on-sides="1"
      :items-per-page="20"
      :total-items="getMediaRatingByUserIdApi.data.value.totalCount"
    />
  </template>
</template>

<style module lang="scss">
.pagination {
  margin-top: 24px;
}
</style>
