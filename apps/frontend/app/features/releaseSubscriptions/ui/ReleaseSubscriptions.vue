<script setup lang="ts">
import type { GetReleaseSubscriptionsByUserIdQueries, MediaTypeEnum } from "@movie-tracker/types"
import { SortOrderEnum } from "@movie-tracker/types"
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useGetReleaseSubscriptionsByUserIdApi } from "~/api/releaseSubscription/useReleaseSubscriptionApi"
import { ReleaseSubscriptionsTable } from "~/features/releaseSubscriptions"
import ReleaseSubscriptionsFilters from "~/features/releaseSubscriptions/ui/ReleaseSubscriptionsFilters.vue"
import ReleaseSubscriptionsHeader from "~/features/releaseSubscriptions/ui/ReleaseSubscriptionsHeader.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiTabsPane } from "~/shared/ui/UiTabs"

const PAGE_SIZE = 10

const page = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const activeTab = useRouteQuery<string>("tab", "all", {
  mode: "replace",
})
const searchTerm = useRouteQuery<string>("searchTerm", "", {
  mode: "replace",
})
const sortType = useRouteQuery<string>("sort", "desc_createdAt", {
  mode: "replace",
})
const mediaType = useRouteQuery<MediaTypeEnum | "all">("mediaType", "all", {
  mode: "replace",
})

const sortParams = computed(() => {
  const [direction, sortBy] = (sortType.value || "desc_createdAt").split("_")

  return {
    sortBy,
    sortDirection: SortOrderEnum[direction!.toUpperCase() as keyof typeof SortOrderEnum],
  }
})

const completed = computed(() => {
  if (activeTab.value === "completed") {
    return true
  }

  if (activeTab.value === "active") {
    return false
  }

  return undefined
})

const getReleaseSubscriptionsByUserIdQueryParams = computed(() => {
  return {
    limit: PAGE_SIZE,
    offset: (page.value - 1) * PAGE_SIZE,
    search: searchTerm.value || undefined,
    completed: completed.value,
    mediaType: mediaType.value === "all" ? undefined : mediaType.value,
    sortBy: (sortParams.value.sortBy || undefined) as GetReleaseSubscriptionsByUserIdQueries["sortBy"],
    sortDirection: sortParams.value.sortDirection as GetReleaseSubscriptionsByUserIdQueries["sortDirection"],
  }
})

const getReleaseSubscriptionsByUserIdApi = useGetReleaseSubscriptionsByUserIdApi(getReleaseSubscriptionsByUserIdQueryParams)

await getReleaseSubscriptionsByUserIdApi.suspense()

watch(() => getReleaseSubscriptionsByUserIdApi.data.value?.items, (newValue) => {
  if (newValue && newValue.length === 0 && page.value > 1) {
    page.value = 1
  }
})

watch([searchTerm, activeTab, mediaType, sortType], () => {
  page.value = 1
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <ReleaseSubscriptionsHeader />

    <template
      v-if="getReleaseSubscriptionsByUserIdApi.data.value?.totalSubscriptionsCount === 0"
    >
      <UiDivider />
      <UiAttention
        :indent="42"
        :title="$t('releaseSubscription.noSubscriptions.title')"
        :description="$t('releaseSubscription.noSubscriptions.description')"
      />
    </template>

    <div
      v-else
      :class="$style.content"
    >
      <UiDivider />

      <ReleaseSubscriptionsFilters
        v-model:search-term="searchTerm"
        v-model:sort-type="sortType"
        v-model:media-type="mediaType"
      />

      <UiTabsPane
        v-model="activeTab"
        :tabs="[
          {
            label: $t('ui.all'),
            key: 'all',
          },
          {
            label: $t('releaseSubscription.tabs.active'),
            key: 'active',
          },
          {
            label: $t('releaseSubscription.tabs.completed'),
            key: 'completed',
          },
        ] as const"
      >
        <template #content>
          <ReleaseSubscriptionsTable
            v-if="getReleaseSubscriptionsByUserIdApi.data.value?.items?.length
              || getReleaseSubscriptionsByUserIdApi.isPending.value"
            v-model:current-page="page"
            :data="getReleaseSubscriptionsByUserIdApi.data.value?.items"
            :total-count="getReleaseSubscriptionsByUserIdApi.data.value?.totalCount"
            :loading="getReleaseSubscriptionsByUserIdApi.isFetching.value"
          />
          <UiAttention
            v-else
            :title="$t('ui.nothingFound')"
            :indent="24"
          />
        </template>
      </UiTabsPane>
    </div>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;
}
</style>
