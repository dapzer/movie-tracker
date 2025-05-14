<script setup lang="ts">
import type { MediaItemType } from "@movie-tracker/types"
import type { SortOrderEnum } from "~/shared/types/Sorting"
import { useCookie } from "#app"
import { useI18n } from "#imports"
import { MediaItemStatusNameEnum } from "@movie-tracker/types"
import { useRouteQuery } from "@vueuse/router"
import { computed, h, ref, watch } from "vue"
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
import { filterMediaListItems } from "~/widgets/mediaList/model/filterMediaListItems"

interface MediaListDetailsProps {
  mediaListItems?: MediaItemType[]
  isLoading: boolean
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

const sortedMediaItems = computed(() => {
  const [sortOrder, sortBy] = sortType.value.split("_")
  return filterMediaListItems(props.mediaListItems ?? [], searchTerm.value, sortOrder as SortOrderEnum, sortBy as keyof
  Pick<MediaItemType, "createdAt" | "updatedAt">)
})

const groupedByStatus = computed(() => {
  const result: Record<MediaItemStatusNameEnum, MediaItemType[]> = {
    [MediaItemStatusNameEnum.WATCHING_NOW]: [],
    [MediaItemStatusNameEnum.NOT_VIEWED]: [],
    [MediaItemStatusNameEnum.WAIT_NEW_PART]: [],
    [MediaItemStatusNameEnum.VIEWED]: [],
  }
  for (const item of sortedMediaItems.value) {
    result[item.trackingData.currentStatus].push(item)
  }

  return result
})

const currentTabMediaItems = computed(() => {
  if (activeTab.value === "all") {
    return sortedMediaItems.value
  }

  return groupedByStatus.value[activeTab.value as MediaItemStatusNameEnum]
})

const currentTabContent = computed(() => {
  return currentTabMediaItems.value.slice((currentPage.value - 1) * 20, currentPage.value * 20)
})

watch(currentTabMediaItems, () => {
  if (currentPage.value > Math.ceil(currentTabMediaItems.value.length / 20)) {
    currentPage.value = 1
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
          label: `${$t('ui.all')} (${sortedMediaItems.length})`,
          key: 'all',
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.WATCHING_NOW}`)} (${groupedByStatus.WATCHING_NOW.length})`,
          key: MediaItemStatusNameEnum.WATCHING_NOW,
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.NOT_VIEWED}`)} (${groupedByStatus.NOT_VIEWED.length})`,
          key: MediaItemStatusNameEnum.NOT_VIEWED,
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.WAIT_NEW_PART}`)} (${groupedByStatus.WAIT_NEW_PART.length})`,
          key: MediaItemStatusNameEnum.WAIT_NEW_PART,
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.VIEWED}`)} (${groupedByStatus.VIEWED.length})`,
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
        <UiCardsGrid v-if="props.isLoading || currentTabMediaItems.length">
          <template v-if="props.isLoading">
            <UiMediaCardSkeleton
              v-for="index in 20"
              :key="index"
            />
          </template>
          <template v-else-if="currentTabMediaItems.length">
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
        <template v-if="!props.isLoading && !currentTabMediaItems.length">
          <UiAttention
            :title="searchTerm.length ? $t('search.notingFound') : activeTab !== 'all' ? $t('mediaList.noMediaItems')
              : $t('mediaList.noMediaItemsAll')"
            :indent="24"
          />
        </template>
        <UiPagination
          v-if="currentTabMediaItems.length"
          v-model="currentPage"
          :class="$style.pagination"
          :pages-on-sides="1"
          :items-per-page="20"
          :total-items="currentTabMediaItems.length"
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
