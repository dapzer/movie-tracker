<script setup lang="ts">
import type { UserPublicType } from "@movie-tracker/types"
import { computed, ref } from "vue"
import { useGetMediaRatingByUserIdApi } from "~/api/mediaRating/useMediaRatingApi"
import MediaRatingCard from "~/entities/mediaRating/ui/MediaRatingCard.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"
import { UiPagination } from "~/shared/ui/UiPagination"

interface UserProfileRatingsProps {
  user: UserPublicType
}

const props = defineProps<UserProfileRatingsProps>()

const getMediaRatingByUserIdArgs = computed(() => {
  return {
    userId: props.user.id,
  }
})

const getMediaRatingByUserIdApi = useGetMediaRatingByUserIdApi(getMediaRatingByUserIdArgs.value)
await getMediaRatingByUserIdApi.suspense()

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
</script>

<template>
  <UiAttention
    v-if="!mediaItems.length"
    :title="$t('userProfile.noRatings')"
  />
  <template v-else>
    <UiCardsGrid>
      <MediaRatingCard
        v-for="movie in mediaItemsToRender"
        :key="movie.id"
        :media-rating="movie"
        :user="props.user"
        full-height
        hide-tracking-menu
      />
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
