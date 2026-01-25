<script setup lang="ts">
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useGetReleaseSubscriptionsByUserIdApi } from "~/api/releaseSubscription/useReleaseSubscriptionApi"
import { ReleaseSubscriptionsTable } from "~/features/releaseSubscriptions"
import ReleaseSubscriptionsHeader from "~/features/releaseSubscriptions/ui/ReleaseSubscriptionsHeader.vue"
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"

const PAGE_SIZE = 10

const page = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const searchTerm = useRouteQuery<string>("searchTerm", "", {
  mode: "replace",
})
const { searchValue } = useDebouncedSearchTerm(searchTerm)

const getReleaseSubscriptionsByUserIdQueryParams = computed(() => {
  return {
    limit: PAGE_SIZE,
    offset: (page.value - 1) * PAGE_SIZE,
    search: searchTerm.value || undefined,
  }
})

const getReleaseSubscriptionsByUserIdApi = useGetReleaseSubscriptionsByUserIdApi(getReleaseSubscriptionsByUserIdQueryParams)

await getReleaseSubscriptionsByUserIdApi.suspense()

watch(() => getReleaseSubscriptionsByUserIdApi.data.value?.items, (newValue) => {
  if (newValue && newValue.length === 0 && page.value > 1) {
    page.value = 1
  }
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <ReleaseSubscriptionsHeader />

    <template v-if="getReleaseSubscriptionsByUserIdApi.data.value?.totalCount === 0 && !searchTerm && page === 1">
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
      <UiInput
        v-model="searchValue"
        :class="$style.search"
        size="small"
        :placeholder="$t('search.placeholder')"
      >
        <template #icon>
          <UiIcon name="icon:search" />
        </template>
      </UiInput>

      <UiDivider />
      <ReleaseSubscriptionsTable
        v-if="getReleaseSubscriptionsByUserIdApi.data.value?.items?.length"
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
    </div>
  </UiContainer>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.search {
  max-width: 384px;
  display: flex;
  gap: 10px;

  @include mobileDevice {
    max-width: 100%;

    height: 40px;
  }
}

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
