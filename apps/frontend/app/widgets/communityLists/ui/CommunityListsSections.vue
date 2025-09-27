<script setup lang="ts">
import type {
  GetCommunityListsAllTimeTopQueries,
  GetCommunityListsNewestQueries,
  GetCommunityListsWeekTopQueries,
} from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { computed, ref } from "vue"
import {
  useGetCommunityListsAllTimeTopApi,
  useGetCommunityListsNewestApi,
  useGetCommunityListsWeekTopApi,
} from "~/api/communityLists/useCommunityListsApi"
import { MediaListCard } from "~/entities/mediaList"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiListsGrid } from "~/shared/ui/UiListsGrid"
import { UiSectionWithSeeMore } from "~/shared/ui/UiSectionWithSeeMore"

const { t } = useI18n()
const localePath = useLocalePath()

const weekTopQueryParams = ref<GetCommunityListsWeekTopQueries>({
  limit: 3,
})
const getCommunityListsWeekTopApi = useGetCommunityListsWeekTopApi(weekTopQueryParams)

const allTimeTopQueryParams = ref<GetCommunityListsAllTimeTopQueries>({
  limit: 6,
})
const getCommunityListsAllTimeTopApi = useGetCommunityListsAllTimeTopApi(allTimeTopQueryParams)

const newestQueryParams = ref<GetCommunityListsNewestQueries>({
  limit: 3,
})
const getCommunityListsNewestApi = useGetCommunityListsNewestApi(newestQueryParams)

await Promise.all([
  getCommunityListsWeekTopApi.suspense(),
  getCommunityListsAllTimeTopApi.suspense(),
  getCommunityListsNewestApi.suspense(),
])

const sections = computed(() => {
  return [
    {
      title: t("communityLists.topOfTheWeek"),
      items: getCommunityListsWeekTopApi.data.value?.items || [],
      seeMoreLink: "/lists/community/week-top",
    },
    {
      title: t("communityLists.allTimeFavorites"),
      items: getCommunityListsAllTimeTopApi.data.value?.items || [],
      seeMoreLink: "/lists/community/all-time-favorites",
    },
    {
      title: t("communityLists.newToExplore"),
      items: getCommunityListsNewestApi.data.value?.items || [],
      seeMoreLink: "/lists/community/new-to-explore",
    },
  ]
})
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <template
      v-for="section in sections"
      :key="section.title"
    >
      <UiSectionWithSeeMore
        v-if="section.items.length"
        :title="section.title"
        :see-more-url="localePath(section.seeMoreLink)"
      >
        <UiListsGrid>
          <MediaListCard
            v-for="communityList in section.items"
            :key="communityList.id"
            :list="communityList"
            hide-access-level
          />
        </UiListsGrid>
      </UiSectionWithSeeMore>
    </template>
  </UiContainer>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 70px;

  @include tabletDevice {
    gap: 60px;
  }

  @include mobileDevice {
    gap: 24px;
  }
}
</style>
