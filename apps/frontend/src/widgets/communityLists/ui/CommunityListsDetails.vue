<script setup lang="ts">
import type { MediaListType } from "@movie-tracker/types"
import { watchDebounced } from "#imports"
import { computed, ref } from "vue"
import { MediaListCard, MediaListCardSkeleton } from "~/entities/mediaList"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiBackLink } from "~/shared/ui/UiBackLink"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiPagination } from "~/shared/ui/UiPagination"
import { UiTypography } from "~/shared/ui/UiTypography"

interface CommunityListsDetailsProps {
  title: string
  isLoading: boolean
  lists: MediaListType[]
  totalCount: number
  getPageHref?: (page: number) => string
  backButtonUrl: string
}

const props = defineProps<CommunityListsDetailsProps>()
const currentPage = defineModel<number>("currentPage")
const searchTerm = defineModel<string>("searchTerm")
const localSearchTerm = ref(searchTerm.value || "")

watchDebounced(
  localSearchTerm,
  () => {
    searchTerm.value = localSearchTerm.value
  },
  { debounce: 500 },
)

const totalPages = computed(() => {
  return Math.ceil(props.totalCount / 20)
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <UiBackLink
      :url="props.backButtonUrl"
    />
    <div :class="$style.header">
      <UiTypography
        variant="title2"
        as="h1"
      >
        {{ props.title }}
      </UiTypography>
      <UiInput
        v-model="localSearchTerm"
        :class="$style.search"
        size="small"
        :placeholder="$t('search.placeholder')"
      >
        <template #icon>
          <UiIcon name="icon:search" />
        </template>
      </UiInput>
    </div>

    <UiDivider />

    <div :class="$style.content">
      <template v-if="props.lists.length && !props.isLoading">
        <template
          v-for="(communityList, index) in props.lists"
          :key="communityList.id"
        >
          <MediaListCard
            horizontal
            hide-access-level
            :list="communityList"
          />
          <UiDivider v-if="index < props.lists.length - 1" />
        </template>
      </template>
      <template v-else-if="props.isLoading">
        <template
          v-for="i in 3"
          :key="i"
        >
          <MediaListCardSkeleton horizontal />
          <UiDivider v-if="i < 3" />
        </template>
      </template>
      <UiAttention
        v-if="!props.isLoading && !props.lists.length"
        title-variant="text"
        :indent="0"
        :title="$t('search.notingFound')"
      />
    </div>

    <template v-if="totalPages >= 1">
      <UiPagination
        v-model="currentPage"
        :class="$style.pagination"
        :pages-on-sides="1"
        :items-per-page="20"
        :total-items="props.totalCount"
        :get-page-href="props.getPageHref"
      />
    </template>
  </UiContainer>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";

.wrapper {
  margin-top: 60px;
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.header {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.search {
  width: 100%;

  @include untilMobileDevice() {
    max-width: 384px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 20px;
}

.pagination {
  margin-top: 4px;
}
</style>
