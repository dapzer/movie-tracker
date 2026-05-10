<script setup lang="ts">
import type { MediaListType, SortOrderEnum } from "@movie-tracker/types"
import { useCookie } from "#app"
import { watchEffect } from "#imports"
import { MediaItemStatusNameEnum, MediaTypeEnum } from "@movie-tracker/types"
import { useRouteQuery } from "@vueuse/router"
import { computed, ref, watch } from "vue"
import {
  useGetMediaItemsByMediaListIdApi,
  useGetMediaItemsCountByMediaListIdApi,
} from "~/api/mediaItems/useMediaItemsApi"
import { MediaCard } from "~/features/mediaCard"
import { LocalStorageEnum } from "~/shared/types/localStorageEnum"
import UiAttention from "~/shared/ui/UiAttention/UiAttention.vue"
import { UiMediaCardSkeleton } from "~/shared/ui/UiCard"
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiTabsPane } from "~/shared/ui/UiTabs"
import { getPaginationParams } from "~/shared/utils/getPaginationParams"
import MediaListDetailsFilters from "~/widgets/mediaList/ui/filters/MediaListDetailsFilters.vue"
import MediaListDetailsSortPopover from "./MediaListDetailsSortPopover.vue"

interface MediaListDetailsProps {
  mediaList: MediaListType
  isUserListOwner?: boolean
}

export type MediaListDetailsSortOption = "asc_createdAt" | "desc_createdAt" | "asc_updatedAt" | "desc_updatedAt"

const props = defineProps<MediaListDetailsProps>()
const storedMediaListSortingType = useCookie<MediaListDetailsSortOption>(LocalStorageEnum.MEDIA_LIST_SORTING_TYPE, {
  default: () => "asc_createdAt",
  expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
})

const sortType = ref<MediaListDetailsSortOption>(storedMediaListSortingType.value)
const activeTab = useRouteQuery<string>("tab", "all", {
  mode: "replace",
})
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

      return value
        .split(",")
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
        return [0, 10]
      }

      const [min, max] = value.split(",")
      const minRating = Number(min)
      const maxRating = Number(max)

      if (Number.isNaN(minRating) || Number.isNaN(maxRating)) {
        return [0, 10]
      }

      return [minRating, maxRating]
    },
    set: value => `${value[0]},${value[1]}`,
  },
})
const releaseYear = useRouteQuery<string, [number | undefined, number | undefined]>("releaseYear", "", {
  mode: "replace",
  transform: {
    get: (value): [number | undefined, number | undefined] => {
      if (!value) {
        return [undefined, undefined]
      }

      const [fromYear, toYear] = value.split(",")
      const parsedFromYear = fromYear ? Number(fromYear) : undefined
      const parsedToYear = toYear ? Number(toYear) : undefined

      return [
        parsedFromYear === undefined || Number.isNaN(parsedFromYear) ? undefined : parsedFromYear,
        parsedToYear === undefined || Number.isNaN(parsedToYear) ? undefined : parsedToYear,
      ]
    },
    set: (value) => {
      const [fromYear, toYear] = value

      if (fromYear === undefined && toYear === undefined) {
        return ""
      }

      return `${fromYear ?? ""},${toYear ?? ""}`
    },
  },
})
const genres = useRouteQuery<string, string[]>("genres", "", {
  mode: "replace",
  transform: {
    get: value => value ? value.split(",").filter(Boolean) : [],
    set: value => value.length ? value.join(",") : "",
  },
})
const releaseStatuses = useRouteQuery<string, string[]>("releaseStatuses", "", {
  mode: "replace",
  transform: {
    get: value => value ? value.split(",").filter(Boolean) : [],
    set: value => value.length ? value.join(",") : "",
  },
})
const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})

const sortConfig = computed(() => {
  const [sortDirection, sortBy] = sortType.value.split("_") as [SortOrderEnum, "createdAt" | "updatedAt"]
  return {
    sortDirection,
    sortBy,
  }
})

const mediaItemsQueryArgs = computed(() => {
  return {
    mediaListId: props.mediaList.id,
    search: searchTerm.value || undefined,
    status: activeTab.value === "all" ? undefined : activeTab.value as MediaItemStatusNameEnum,
    mediaTypes: mediaTypes.value.length ? mediaTypes.value : undefined,
    rating: rating.value[0] === 0 && rating.value[1] === 10 ? undefined : rating.value,
    releaseYear:
      releaseYear.value[0] === undefined && releaseYear.value[1] === undefined
        ? undefined
        : releaseYear.value,
    genres: genres.value.length ? genres.value.map(Number) : undefined,
    releaseStatuses: releaseStatuses.value.length ? releaseStatuses.value : undefined,
    sortBy: sortConfig.value.sortBy,
    sortDirection: sortConfig.value.sortDirection,
    ...getPaginationParams({
      itemsPerPage: 20,
      page: currentPage.value,
    }),
  }
})

const getMediaItemsCountByMediaListIdArgs = computed(() => {
  return {
    mediaListId: props.mediaList.id,
    search: searchTerm.value || undefined,
    mediaTypes: mediaTypes.value.length ? mediaTypes.value : undefined,
    rating: rating.value[0] === 0 && rating.value[1] === 10 ? undefined : rating.value,
    releaseYear:
      releaseYear.value[0] === undefined && releaseYear.value[1] === undefined
        ? undefined
        : releaseYear.value,
    genres: genres.value.length ? genres.value.map(Number) : undefined,
    releaseStatuses: releaseStatuses.value.length ? releaseStatuses.value : undefined,
  }
})

const getMediaItemsByMediaListIdApi = useGetMediaItemsByMediaListIdApi(mediaItemsQueryArgs, {
  staleTime: 0,
})
const getMediaItemsCountByMediaListIdApi = useGetMediaItemsCountByMediaListIdApi(getMediaItemsCountByMediaListIdArgs)

await Promise.all([
  getMediaItemsByMediaListIdApi.suspense(),
  getMediaItemsCountByMediaListIdApi.suspense(),
])

watch(() => sortType.value, () => {
  storedMediaListSortingType.value = sortType.value
})

watch([searchTerm, activeTab], () => {
  currentPage.value = 1
})

const pagedResponse = computed(() => {
  return getMediaItemsByMediaListIdApi.data.value
})

const groupedByStatus = computed(() => {
  return getMediaItemsCountByMediaListIdApi.data.value
})

const totalItems = computed(() => pagedResponse.value?.totalCount ?? 0)
const currentTabContent = computed(() => pagedResponse.value?.items ?? [])

const loadingSkeletonsCount = computed(() => {
  const tabKey = activeTab.value === "all" ? "total" : activeTab.value
  const countByStatus = groupedByStatus.value?.[tabKey as keyof typeof groupedByStatus.value] ?? 0
  const itemsOnPreviousPages = currentPage.value * 20

  return Math.min(Math.max(countByStatus - itemsOnPreviousPages, 6), 20)
})

watchEffect(() => {
  if (!getMediaItemsByMediaListIdApi.isFetching.value && currentTabContent.value.length === 0) {
    currentPage.value = Math.max(currentPage.value - 1, 1)
  }
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiTabsPane
      v-model="activeTab"
      :class="$style.tabs"
      :tabs="[
        {
          label: $t('ui.all'),
          description: groupedByStatus?.total,
          key: 'all',
        },
        {
          label: $t(`mediaItem.status.${MediaItemStatusNameEnum.WATCHING_NOW}`),
          description: groupedByStatus?.WATCHING_NOW,
          key: MediaItemStatusNameEnum.WATCHING_NOW,
        },
        {
          label: $t(`mediaItem.status.${MediaItemStatusNameEnum.NOT_VIEWED}`),
          description: groupedByStatus?.NOT_VIEWED,
          key: MediaItemStatusNameEnum.NOT_VIEWED,
        },
        {
          label: $t(`mediaItem.status.${MediaItemStatusNameEnum.WAIT_NEW_PART}`),
          description: groupedByStatus?.WAIT_NEW_PART,
          key: MediaItemStatusNameEnum.WAIT_NEW_PART,
        },
        {
          label: $t(`mediaItem.status.${MediaItemStatusNameEnum.VIEWED}`),
          description: groupedByStatus?.VIEWED,
          key: MediaItemStatusNameEnum.VIEWED,
        },
      ] as const"
    >
      <template #content>
        <div :class="$style.controls">
          <MediaListDetailsFilters
            v-model:search-term="searchTerm"
            v-model:media-types="mediaTypes"
            v-model:rating="rating"
            v-model:release-year="releaseYear"
            v-model:genres="genres"
            v-model:release-statuses="releaseStatuses"
          />
          <MediaListDetailsSortPopover
            v-model="sortType"
          />
        </div>

        <UiCardsGrid v-if="getMediaItemsByMediaListIdApi.isPending.value || currentTabContent.length">
          <template v-if="getMediaItemsByMediaListIdApi.isPending.value">
            <UiMediaCardSkeleton
              v-for="index in loadingSkeletonsCount"
              :key="index"
            />
          </template>
          <template v-else-if="currentTabContent.length">
            <MediaCard
              v-for="movie in currentTabContent"
              :key="movie.id"
              :media-item="movie"
              full-height
              :hide-tracking-menu="!isUserListOwner"
              :can-edit-rating="isUserListOwner"
            />
          </template>
        </UiCardsGrid>
        <template v-else>
          <UiAttention
            :title="searchTerm.length ? $t('search.notingFound') : activeTab !== 'all' ? $t('mediaList.noMediaItems')
              : $t('mediaList.noMediaItemsAll')"
            :indent="24"
          />
        </template>
        <UiPagination
          v-if="currentTabContent.length"
          v-model="currentPage"
          :class="$style.pagination"
          :pages-on-sides="1"
          :items-per-page="20"
          :total-items="totalItems"
        />
      </template>
    </UiTabsPane>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .controls {
    display: flex;
    align-items: center;
    justify-content: space-between;
    gap: 12px;
    margin-bottom: 8px;

    & > div {
      flex: 1;
    }
  }

  .tabs {
    min-height: 506px;
  }

  .pagination {
    margin-top: 24px;
  }
}
</style>
