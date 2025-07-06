<script setup lang="ts">
import type { GetCommunityListsAllTimeTopQueries } from "@movie-tracker/types"
import { useLocalePath } from "#i18n"
import { useI18n, useSeoMeta } from "#imports"
import { useRouteQuery } from "@vueuse/router"
import { computed, watch } from "vue"
import { useCommunityListsAllTimeTopApi } from "~/api/communityLists/useCommunityListsApi"
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

const queryParams = computed<GetCommunityListsAllTimeTopQueries>(() => ({
  limit: 20,
  offset: (currentPage.value - 1) * 20,
  title: searchTerm.value,
}))
const communityListsAllTimeTopApi = useCommunityListsAllTimeTopApi(queryParams)

watch([searchTerm], () => {
  currentPage.value = 1
})

await communityListsAllTimeTopApi.suspense()

useSeoMeta({
  titleTemplate(titleChunk) {
    return `${t("communityLists.allTimeFavorites")} | ${titleChunk}`
  },
  ogTitle() {
    return `%s | ${t("communityLists.allTimeFavorites")}`
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
    :title="$t('communityLists.allTimeFavorites')"
    :is-loading="communityListsAllTimeTopApi.isFetching.value"
    :lists="communityListsAllTimeTopApi.data?.value?.items || []"
    :total-count="communityListsAllTimeTopApi.data?.value?.totalCount || 0"
  />
</template>

<style scoped lang="scss">

</style>
