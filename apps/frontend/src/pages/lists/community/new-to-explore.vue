<script setup lang="ts">
import type { GetCommunityListsNewestQueries } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n, useSeoMeta } from "#imports"
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useGetCommunityListsNewestApi } from "~/api/communityLists/useCommunityListsApi"
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

const queryParams = computed<GetCommunityListsNewestQueries>(() => ({
  limit: 20,
  offset: (currentPage.value - 1) * 20,
  title: searchTerm.value,
}))
const getCommunityListsNewestApi = useGetCommunityListsNewestApi(queryParams)

watch([searchTerm], () => {
  currentPage.value = 1
})

await getCommunityListsNewestApi.suspense()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("communityLists.newToExplore")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("communityLists.newToExplore")}`
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
    :title="$t('communityLists.newToExplore')"
    :is-loading="getCommunityListsNewestApi.isFetching.value"
    :lists="getCommunityListsNewestApi.data?.value?.items || []"
    :total-count="getCommunityListsNewestApi.data?.value?.totalCount || 0"
  />
</template>

<style scoped lang="scss">

</style>
