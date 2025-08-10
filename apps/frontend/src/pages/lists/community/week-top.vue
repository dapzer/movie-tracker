<script setup lang="ts">
import type { GetCommunityListsWeekTopQueries } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n, useSeoMeta } from "#imports"
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useGetCommunityListsWeekTopApi } from "~/api/communityLists/useCommunityListsApi"
import { CommunityListsDetails } from "~/widgets/communityLists"

const { t } = useI18n()
const localePath = useLocalePath()

const currentPage = useRouteQuery<number>("page", 1, {
  transform: Number,
  mode: "replace",
})
const searchTerm = useRouteQuery<string>("searchTerm", "", {
  mode: "replace",
})

const queryParams = computed<GetCommunityListsWeekTopQueries>(() => ({
  limit: 20,
  offset: (currentPage.value - 1) * 20,
  title: searchTerm.value,
}))
const getCommunityListsWeekTopApi = useGetCommunityListsWeekTopApi(queryParams)

await getCommunityListsWeekTopApi.suspense()

watch([searchTerm], () => {
  currentPage.value = 1
})

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("communityLists.topOfTheWeek")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("communityLists.topOfTheWeek")}`
  },
  ogDescription() {
    return t("communityLists.hero.description")
  },
})
</script>

<template>
  <CommunityListsDetails
    v-model:current-page="currentPage"
    v-model:search-term="searchTerm"
    :back-button-url="localePath('/lists/community')"
    :title="$t('communityLists.topOfTheWeek')"
    :is-loading="getCommunityListsWeekTopApi.isFetching.value"
    :lists="getCommunityListsWeekTopApi.data?.value?.items || []"
    :total-count="getCommunityListsWeekTopApi.data?.value?.totalCount || 0"
  />
</template>

<style scoped lang="scss">

</style>
