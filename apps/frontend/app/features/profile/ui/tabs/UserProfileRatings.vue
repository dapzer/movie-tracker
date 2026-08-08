<script setup lang="ts">
import type { SortOrderEnum, UserPublicType } from "@movie-tracker/types"
import type { FetchError } from "@movie-tracker/utils"
import type { GetMediaRatingByUserIdArgs } from "~/api/mediaRatings/mediaRatingsApiTypes"
import { MediaTypeEnum } from "@movie-tracker/types"
import { HttpStatus } from "@movie-tracker/utils"
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useGetMediaRatingByUserIdApi } from "~/api/mediaRatings/useMediaRatingsApi"
import MediaRatingCard from "~/entities/mediaRating/ui/MediaRatingCard.vue"
import UserProfileRatingSortPopover from "~/features/profile/ui/tabs/UserProfileRatingSortPopover.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiMediaCardSkeleton } from "~/shared/ui/UiCard"
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"
import { UiPagination } from "~/shared/ui/UiPagination"
import { getPaginationParams } from "~/shared/utils/getPaginationParams.ts"
import UserProfileRatingsFilters from "./UserProfileRatingsFilters.vue"

interface UserProfileRatingsProps {
  user: UserPublicType
  ratingsCount?: number
}

const props = defineProps<UserProfileRatingsProps>()

export type UserProfileRatingsSortOption = | "asc_createdAt"
  | "desc_createdAt"
  | "asc_rating"
  | "desc_rating"

const RATING_MIN = 0
const RATING_MAX = 10

const searchTerm = useRouteQuery<string>("searchTerm", "", {
  mode: "replace",
})
const mediaTypes = useRouteQuery<string, MediaTypeEnum[]>("mediaTypes", "", {
  mode: "replace",
  transform: {
    get: (value) => {
      if (!value) {
        return []
      }

      return value.split(",")
        .filter((type): type is MediaTypeEnum => type === MediaTypeEnum.MOVIE || type === MediaTypeEnum.TV)
    },
    set: value => value.length ? value.join(",") : "",
  },
})
const rating = useRouteQuery<string, [number, number]>("rating", "0,10", {
  mode: "replace",
  transform: {
    get: (value): [number, number] => {
      if (!value) {
        return [RATING_MIN, RATING_MAX]
      }

      const [minimum, maximum] = value.split(",")
      const minimumRating = Number(minimum)
      const maximumRating = Number(maximum)

      if (Number.isNaN(minimumRating)
        || Number.isNaN(maximumRating)
        || minimumRating < RATING_MIN
        || maximumRating > RATING_MAX
        || minimumRating > maximumRating) {
        return [RATING_MIN, RATING_MAX]
      }

      return [minimumRating, maximumRating]
    },
    set: value => `${value[0]},${value[1]}`,
  },
})
const sortType = useRouteQuery<string, UserProfileRatingsSortOption>("sort", "desc_createdAt", {
  mode: "replace",
  transform: {
    get: value => value as UserProfileRatingsSortOption,
    set: value => value,
  },
})
const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})

const isDefaultRating = computed(() => {
  return rating.value[0] === RATING_MIN && rating.value[1] === RATING_MAX
})

const isFiltersActive = computed(() => {
  return Boolean(searchTerm.value || mediaTypes.value.length || !isDefaultRating.value)
})

const sortConfig = computed(() => {
  const [sortDirection, sortBy] = sortType.value.split("_") as [SortOrderEnum, "createdAt" | "rating"]
  return {
    sortDirection,
    sortBy,
  }
})

const getMediaRatingByUserIdArgs = computed<GetMediaRatingByUserIdArgs>(() => {
  return {
    userId: props.user.id,
    search: searchTerm.value || undefined,
    mediaTypes: mediaTypes.value.length ? mediaTypes.value : undefined,
    rating: isDefaultRating.value ? undefined : rating.value,
    sortBy: sortConfig.value.sortBy,
    sortDirection: sortConfig.value.sortDirection,
    ...getPaginationParams({
      page: currentPage.value,
      itemsPerPage: 20,
    }),
  }
})

const getMediaRatingByUserIdApi = useGetMediaRatingByUserIdApi(getMediaRatingByUserIdArgs)
await getMediaRatingByUserIdApi.suspense()

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

watch([searchTerm, mediaTypes, rating, sortType], () => {
  currentPage.value = 1
})
</script>

<template>
  <UiAttention
    v-if="isPrivate"
    :title="$t('userProfile.privateRatings')"
  />
  <UiAttention
    v-else-if="!props.ratingsCount"
    :title="$t('userProfile.noRatings')"
  />
  <template v-else>
    <div :class="$style.controls">
      <UserProfileRatingsFilters
        v-model:search-term="searchTerm"
        v-model:media-types="mediaTypes"
        v-model:rating="rating"
      />
      <UserProfileRatingSortPopover v-model="sortType" />
    </div>

    <UiCardsGrid v-if="getMediaRatingByUserIdApi.isLoading.value || mediaItems.length">
      <template v-if="!getMediaRatingByUserIdApi.isLoading.value">
        <MediaRatingCard
          v-for="movie in mediaItems"
          :key="movie.id"
          :media-rating="movie"
          :user="props.user"
          full-height
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
    <UiAttention
      v-else
      :title="isFiltersActive ? $t('search.nothingFound') : $t('userProfile.noRatings')"
      :indent="24"
    />
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
@use "~/shared/styles/mixins" as *;

.controls {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 12px;
  margin-bottom: 8px;

  & > div {
    flex: 1;
  }

  @include mobilePlusDevice {
    gap: 8px;
  }
}

.pagination {
  margin-top: 24px;
}
</style>
