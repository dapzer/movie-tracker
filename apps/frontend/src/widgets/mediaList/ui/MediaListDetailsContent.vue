<script setup lang="ts">
import { MediaItemStatusNameEnum, type MediaItemType } from "@movie-tracker/types"
import { UiInput } from "~/components/ui/UiInput"
import { SearchIcon, SortArrowDownIcon, SortArrowUpIcon, SortIcon } from "~/components/ui/icons"
import { UiSelect } from "~/components/ui/UiSelect"
import { computed, ref, watch } from "vue"
import { useI18n } from "#imports"
import { UiDropdown, UiDropdownItem } from "~/components/ui/UiDropdown"
import { UiTabsPane } from "~/components/ui/UiTabs"
import { UiDivider } from "~/components/ui/UiDivider"
import { UiCardsGrid } from "~/components/ui/UiCardsGrid"
import { UiMediaCardSkeleton } from "~/components/ui/UiCard"
import { filterMediaListItems } from "~/widgets/mediaList/model/filterMediaListItems"
import { UiPagination } from "~/components/ui/UiPagination"
import UiAttention from "~/components/ui/UiAttention/UiAttention.vue"
import { MediaCard } from "~/features/mediaCard"
import { LocalStorageEnum } from "~/types/localStorageEnum"
import { useCookie } from "#app"

interface MediaListDetailsProps {
  mediaListItems?: MediaItemType[];
  isLoading: boolean;
  isUserListOwner?: boolean;
}

const props = defineProps<MediaListDetailsProps>();
const storedMediaListSortingType = useCookie(LocalStorageEnum.MEDIA_LIST_SORTING_TYPE, {
  default: () =>  'asc_createdAt',
  expires: new Date(new Date().setFullYear(new Date().getFullYear() + 1))
});

const sortType = ref<string>(storedMediaListSortingType.value);
const activeTab = ref<string>('all');
const searchTerm = ref<string>('');
const currentPage = ref<number>(1);
const { t } = useI18n();

watch(() => sortType.value, () => {
  storedMediaListSortingType.value = sortType.value
})

watch([searchTerm, activeTab], () => {
  currentPage.value = 1
})

const options = computed(() => {
  return [
    {
      label: t("mediaList.sort.createdAt"),
      value: 'asc_createdAt',
      icon: SortArrowUpIcon
    },
    {
      label: t("mediaList.sort.createdAt"),
      value: 'desc_createdAt',
      icon: SortArrowDownIcon
    },
    {
      label: t("mediaList.sort.updatedAt"),
      value: 'asc_updatedAt',
      icon: SortArrowUpIcon
    },
    {
      label: t("mediaList.sort.updatedAt"),
      value: 'desc_updatedAt',
      icon: SortArrowDownIcon
    },
  ]
})

const sortedMediaItems = computed(() => {
  const [sortOrder, sortBy] = sortType.value.split('_')
  return filterMediaListItems(props.mediaListItems ?? [], searchTerm.value, sortOrder, sortBy as keyof Pick<MediaItemType,
      "createdAt" | "updatedAt">)
})

const groupedByStatus = computed(() => {
  let result: Record<MediaItemStatusNameEnum, MediaItemType[]> = {
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
  if (activeTab.value === 'all') {
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
          <SearchIcon />
        </template>
      </UiInput>

      <UiDropdown
        align="end"
        :indent="12"
        :trigger-class="$style.dropdownTrigger"
      >
        <template #trigger>
          <SortIcon />
        </template>

        <template #content>
          <UiDropdownItem
            v-for="option in options"
            :key="option.value"
            @click="sortType = option.value"
          >
            <template #iconStart>
              <component
                :is="option.icon"
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
          key: 'all'
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.WATCHING_NOW}`)} (${groupedByStatus.WATCHING_NOW.length})`,
          key: MediaItemStatusNameEnum.WATCHING_NOW
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.NOT_VIEWED}`)} (${groupedByStatus.NOT_VIEWED.length})`,
          key: MediaItemStatusNameEnum.NOT_VIEWED
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.WAIT_NEW_PART}`)} (${groupedByStatus.WAIT_NEW_PART.length})`,
          key: MediaItemStatusNameEnum.WAIT_NEW_PART
        },
        {
          label: `${$t(`mediaItem.status.${MediaItemStatusNameEnum.VIEWED}`)} (${groupedByStatus.VIEWED.length})`,
          key: MediaItemStatusNameEnum.VIEWED
        }
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
@import "~/styles/mixins";
@import "~/styles/variables";

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
