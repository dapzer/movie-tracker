<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import type { FetchError } from "@movie-tracker/utils"
import { onServerPrefetch } from "#imports"
import { HttpStatus } from "@movie-tracker/utils"
import { computed, ref } from "vue"
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

const getMediaRatingByUserIdArgs = computed(() => {
  return {
    userId: props.user.id,
  }
})

const getMediaRatingByUserIdApi = useGetMediaRatingByUserIdApi(getMediaRatingByUserIdArgs.value)
onServerPrefetch(async () => {
  await getMediaRatingByUserIdApi.suspense()
})

const currentPage = ref(1)

const mediaItems = computed(() => {
  if (!getMediaRatingByUserIdApi.data.value) {
    return []
  }
  return getMediaRatingByUserIdApi.data.value
})

const mediaItemsToRender = computed(() => {
  if (!getMediaRatingByUserIdApi.data.value) {
    return []
  }
  return getMediaRatingByUserIdApi.data.value.slice((currentPage.value - 1) * 20, currentPage.value * 20)
})

const isPrivate = computed(() => {
  return (getMediaRatingByUserIdApi.error.value as FetchError)?.statusCode === HttpStatus.FORBIDDEN
})

const loadingSleletonCount = computed(() => {
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
          v-for="movie in mediaItemsToRender"
          :key="movie.id"
          :media-rating="movie"
          :user="props.user"
          full-height
          hide-tracking-menu
        />
      </template>
      <template v-else>
        <UiMediaCardSkeleton
          v-for="i in loadingSleletonCount"
          :key="i"
          loading-skeleton
          full-height
          hide-tracking-menu
        />
      </template>
    </UiCardsGrid>
    <UiPagination
      v-if="mediaItems.length"
      v-model="currentPage"
      :class="$style.pagination"
      :pages-on-sides="1"
      :items-per-page="20"
      :total-items="mediaItems.length"
    />
  </template>
</template>

<style module lang="scss">
.pagination {
  margin-top: 24px;
}
</style>
