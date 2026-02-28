<script setup lang="ts">
import type { MediaListType, SortOrderEnum } from "@movie-tracker/types"
import { useCookie } from "#app"
import { useI18n, watchEffect } from "#imports"
import { MediaItemStatusNameEnum } from "@movie-tracker/types"
import { useRouteQuery } from "@vueuse/router"
import { computed, h, ref, watch } from "vue"
import {
  useGetMediaItemsByMediaListIdApi,
  useGetMediaItemsCountByMediaListIdApi,
} from "~/api/mediaItem/useMediaItemtApi"
import { MediaCard } from "~/features/mediaCard"
import { LocalStorageEnum } from "~/shared/types/localStorageEnum"
import UiAttention from "~/shared/ui/UiAttention/UiAttention.vue"
import { UiMediaCardSkeleton } from "~/shared/ui/UiCard"
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiDropdown, UiDropdownItem } from "~/shared/ui/UiDropdown"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiSelect } from "~/shared/ui/UiSelect"
import { UiTabsPane } from "~/shared/ui/UiTabs"
import { getPaginationParams } from "~/shared/utils/getPaginationParams"

interface MediaListDetailsProps {
  mediaList: MediaListType
  isUserListOwner?: boolean
}

const props = defineProps<MediaListDetailsProps>()
const storedMediaListSortingType = useCookie(LocalStorageEnum.MEDIA_LIST_SORTING_TYPE, {
  default: () => "asc_createdAt",
  expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1)),
})

const sortType = ref<string>(storedMediaListSortingType.value)
const activeTab = useRouteQuery<string>("tab", "all", {
  mode: "replace",
})
const searchTerm = useRouteQuery<string>("searchTerm", "", {
  mode: "replace",
})
const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const { t } = useI18n()

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

const sortArrowUpIcon = h(UiIcon, { name: "icon:sort-arrow-up" })
const sortArrowDownIcon = h(UiIcon, { name: "icon:sort-arrow-down" })

const options = computed(() => {
  return [
    {
      label: t("mediaList.sort.createdAt"),
      value: "asc_createdAt",
      icon: sortArrowUpIcon,
    },
    {
      label: t("mediaList.sort.createdAt"),
      value: "desc_createdAt",
      icon: sortArrowDownIcon,
    },
    {
      label: t("mediaList.sort.updatedAt"),
      value: "asc_updatedAt",
      icon: sortArrowUpIcon,
    },
    {
      label: t("mediaList.sort.updatedAt"),
      value: "desc_updatedAt",
      icon: sortArrowDownIcon,
    },
  ]
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
  const countByStatus = groupedByStatus.value?.[activeTab.value as keyof typeof groupedByStatus.value] ?? 0
  const itemsOnPreviousPages = (currentPage.value - 1) * 20

  return Math.min(((countByStatus - itemsOnPreviousPages) || 6), 20)
})

watchEffect(() => {
  if (!getMediaItemsByMediaListIdApi.isFetching.value && currentTabContent.value.length === 0) {
    currentPage.value = Math.max(currentPage.value - 1, 1)
  }
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.search">
      <UiInput
        v-model="searchTerm"
        size="small"
        :placeholder="$t('search.placeholder')"
      >
        <template #icon>
          <UiIcon name="icon:search" />
        </template>
      </UiInput>

      <UiDropdown
        align="end"
        :indent="12"
        :trigger-class="$style.dropdownTrigger"
      >
        <template #trigger>
          <UiIcon
            name="icon:sort"
            :size="20"
          />
        </template>

        <template #content>
          <UiDropdownItem
            v-for="option in options"
            :key="option.value"
            @click="sortType = option.value"
          >
            <template #iconStart>
              <component
                :is="option?.icon"
                v-if="option?.icon"
              />
            </template>
            <template #content>
              {{ option.label }}
            </template>
          </UiDropdownItem>
        </template>
      </UiDropdown>
    </div>
    <UiDivider />
    <UiTabsPane
      v-model="activeTab"
      :class="$style.tabs"
      :tabs="[
        {
          label: `${$t('ui.all')} (${groupedByStatus?.total || 0})`,
          key: 'all',
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.WATCHING_NOW}`)} (${groupedByStatus?.WATCHING_NOW || 0})`,
          key: MediaItemStatusNameEnum.WATCHING_NOW,
        },
        {
          label:
            `${$t(`mediaItem.status.${MediaItemStatusNameEnum.NOT_VIEWED}`)} (${groupedByStatus?.NOT_VIEWED || 0})`,
          key: MediaItemStatusNameEnum.NOT_VIEWED,
        },
        {
          label:
            `${$t(`mediaItem.status.${MediaItemStatusNameEnum.WAIT_NEW_PART}`)} (${groupedByStatus?.WAIT_NEW_PART || 0})`,
          key: MediaItemStatusNameEnum.WAIT_NEW_PART,
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.VIEWED}`)} (${groupedByStatus?.VIEWED || 0})`,
          key: MediaItemStatusNameEnum.VIEWED,
        },
      ] as const"
    >
      <template #afterTabs>
        <UiSelect
          v-model="sortType"
          :class="$style.select"
          :width="232"
          :options="options"
        />
      </template>
      <template #content>
        <UiCardsGrid v-if="getMediaItemsByMediaListIdApi.isPending.value || currentTabContent.length">
          <template v-if="getMediaItemsByMediaListIdApi.isPending.value">
            <UiMediaCardSkeleton
              v-for="index in loadingSkeletonsCount"
              :key="index"
            />
          </template>
          <template v-else>
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
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .search {
    max-width: 384px;
    display: flex;
    gap: 10px;

    @include mobileDevice {
      max-width: 100%;

      input {
        height: 40px;
      }
    }
  }

  .dropdownTrigger {
    display: none;

    @include mobileDevice {
      width: 38px;
      min-width: 38px;
      height: 38px;
      background: var(--c-card-background-hovered);
      border: 1px solid var(--c-stroke);
      border-radius: var(--s-border-radius-medium);
      display: flex;
      align-items: center;
      justify-content: center;
    }
  }

  @include mobileDevice {
    .select {
      display: none;
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
