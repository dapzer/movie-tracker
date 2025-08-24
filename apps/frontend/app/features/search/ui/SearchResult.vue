<script setup lang="ts">
import type { MediaListType, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { useI18n } from "#imports"
import { useRoute } from "#vue-router"
// eslint-disable-next-line ts/ban-ts-comment
// @ts-ignore
import { MediaTypeEnum } from "@movie-tracker/types"
import { computed, ref, watch } from "vue"
import { useRouter } from "vue-router"
import { useGetCommunityListsSearchApi } from "~/api/communityLists/useCommunityListsApi"
import {
  useGetTmdbSearchMovieByTermApi,
  useGetTmdbSearchPersonByTermApi,
  useGetTmdbSearchTvByTermApi,
} from "~/api/tmdb/useTmdbApi"
import { MediaListCard, MediaListCardSkeleton } from "~/entities/mediaList"
import { PersonCard } from "~/entities/personCard"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import SearchResultForMediaItems from "~/features/search/ui/SearchResultForMediaItems.vue"
import SearchResultForMediaLists from "~/features/search/ui/SearchResultForMediaLists.vue"
import SearchResultPagination from "~/features/search/ui/SearchResultPagination.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiMediaCardSkeleton } from "~/shared/ui/UiCard"
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiListsGrid } from "~/shared/ui/UiListsGrid"
import { UiSectionWithSeeMore } from "~/shared/ui/UiSectionWithSeeMore"
import { UiTabsPane } from "~/shared/ui/UiTabs"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getMatchesDeclensionTranslationKey } from "~/shared/utils/getMatchesDeclensionTranslationKey"

type Tab = "all" | "movies" | "tvs" | "persons" | "lists"

const { locale } = useI18n()

const route = useRoute()
const router = useRouter()
const searchTerm = ref(route.query.searchTerm as string)
const contentCount = ref({
  movie: 0,
  tv: 0,
  person: 0,
  lists: 0,
  get total() {
    return this.movie + this.tv + this.person + this.lists
  },
})

watch(() => route.query.searchTerm, () => {
  if ("searchTerm" in route.query) {
    searchTerm.value = route.query.searchTerm as string
  }
})

const activeTab = ref<Tab>(route.query.activeTab?.toString() as Tab || "all")
const currentPage = ref(Number(route.query.page || 1))

function updateQueryParams() {
  router.push({
    query: {
      searchTerm: searchTerm.value,
      activeTab: activeTab.value,
      page: currentPage.value,
    },
  })
}

watch(() => activeTab.value, () => {
  currentPage.value = 1
  updateQueryParams()
})

watch(() => currentPage.value, () => {
  updateQueryParams()
})

const searchQueries = computed(() => ({
  searchValue: searchTerm.value,
  language: locale.value,
  page: currentPage.value,
}))

const getTmdbSearchMovieByTerm = useGetTmdbSearchMovieByTermApi(searchQueries)
const getTmdbSearchTvByTerm = useGetTmdbSearchTvByTermApi(searchQueries)
const getTmdbSearchPersonByTerm = useGetTmdbSearchPersonByTermApi(searchQueries)

const getCommunityListsSearchApiQueries = computed(() => ({
  limit: 20,
  offset: (currentPage.value - 1) * 20,
  title: searchTerm.value,
}))

const getCommunityListsSearchApi = useGetCommunityListsSearchApi(getCommunityListsSearchApiQueries)

await Promise.all([
  getTmdbSearchMovieByTerm.suspense(),
  getTmdbSearchTvByTerm.suspense(),
  getTmdbSearchPersonByTerm.suspense(),
  getCommunityListsSearchApi.suspense(),
])

watch([
  getTmdbSearchMovieByTerm.isPending,
  getTmdbSearchTvByTerm.isPending,
  getTmdbSearchPersonByTerm.isPending,
  getCommunityListsSearchApi.isPending,
], () => {
  if (getTmdbSearchMovieByTerm.isPending.value || getTmdbSearchTvByTerm.isPending.value
    || getTmdbSearchPersonByTerm.isPending.value || getCommunityListsSearchApi.isPending.value) {
    return
  }
  contentCount.value.movie = getTmdbSearchMovieByTerm.data.value?.total_results || 0
  contentCount.value.tv = getTmdbSearchTvByTerm.data.value?.total_results || 0
  contentCount.value.person = getTmdbSearchPersonByTerm.data.value?.total_results || 0
  contentCount.value.lists = getCommunityListsSearchApi.data.value?.totalCount || 0
}, { immediate: true })

const dataToRender = computed(() => {
  if (activeTab.value === "movies") {
    return {
      items: getTmdbSearchMovieByTerm.data.value?.results,
      totalPage: getTmdbSearchMovieByTerm.data.value?.total_pages,
    }
  }

  if (activeTab.value === "tvs") {
    return {
      items: getTmdbSearchTvByTerm.data.value?.results,
      totalPage: getTmdbSearchTvByTerm.data.value?.total_pages,
    }
  }

  if (activeTab.value === "persons") {
    return {
      items: getTmdbSearchPersonByTerm.data.value?.results,
      totalPage: getTmdbSearchPersonByTerm.data.value?.total_pages,
    }
  }

  if (activeTab.value === "lists") {
    return {
      items: getCommunityListsSearchApi.data.value?.items,
      totalPage: (getCommunityListsSearchApi.data.value?.totalCount || 0) / getCommunityListsSearchApiQueries.value.limit,
    }
  }

  return {
    items: [],
    totalPage: 0,
  }
})

const isPending = computed(() => {
  return getTmdbSearchMovieByTerm.isPending.value
    || getTmdbSearchTvByTerm.isPending.value
    || getTmdbSearchPersonByTerm.isPending.value
    || getCommunityListsSearchApi.isPending.value
})

function handleTabChange(tab: Tab) {
  activeTab.value = tab
}
</script>

<template>
  <UiContainer :class="$style.wrapper">
    <div :class="$style.header">
      <UiTypography
        as="h1"
        variant="title"
      >
        {{ $t("search.title") }}
      </UiTypography>

      <UiTypography
        variant="description"
      >
        {{
          $t("search.description", {
            count: `${contentCount.total} ${$t(getMatchesDeclensionTranslationKey(contentCount.total))}`,
            searchTerm,
          })
        }}
      </UiTypography>

      <UiDivider />
    </div>
    <UiTabsPane
      v-model="activeTab"
      :tabs="[
        {
          label: `${$t('ui.all')} (${contentCount.total})`,
          key: 'all',
        },
        {
          label: `${$t('details.mediaType.movies')} (${contentCount.movie})`,
          key: 'movies',
        },
        {
          label: `${$t('details.mediaType.tvs')} (${contentCount.tv})`,
          key: 'tvs',
        },
        {
          label: `${$t('details.mediaType.persons')} (${contentCount.person})`,
          key: 'persons',
        },
        {
          label: `${$t('details.mediaType.lists')} (${contentCount.lists})`,
          key: 'lists',
        },
      ] as const"
    >
      <template #content>
        <div
          v-if="activeTab === 'all'"
          :class="$style.all"
        >
          <UiAttention
            v-if="!contentCount.total"
            title-variant="text"
            :indent="0"
            :title="$t('search.notingFound')"
          />
          <UiSectionWithSeeMore
            v-if="contentCount.movie"
            see-more-align="end"
            :title="$t('details.mediaType.movies')"
            @on-click-see-more="() => handleTabChange('movies')"
          >
            <UiCardsGrid>
              <template v-if="!isPending">
                <MovieCardWithHoverMenu
                  v-for="item in getTmdbSearchMovieByTerm.data.value?.results.slice(0, 6)"
                  :key="item.id"
                  full-height
                  :movie="{ ...item, media_type: MediaTypeEnum.MOVIE }"
                />
              </template>
              <template v-else>
                <UiMediaCardSkeleton
                  v-for="index in 6"
                  :key="index"
                />
              </template>
            </UiCardsGrid>
          </UiSectionWithSeeMore>
          <UiSectionWithSeeMore
            v-if="contentCount.tv"
            see-more-align="end"
            :title="$t('details.mediaType.tvs')"
            @on-click-see-more="() => handleTabChange('tvs')"
          >
            <UiCardsGrid>
              <template v-if="!isPending">
                <MovieCardWithHoverMenu
                  v-for="item in getTmdbSearchTvByTerm.data.value?.results.slice(0, 6)"
                  :key="item.id"
                  full-height
                  :movie="{ ...item, media_type: MediaTypeEnum.TV }"
                />
              </template>
              <template v-else>
                <UiMediaCardSkeleton
                  v-for="index in 6"
                  :key="index"
                />
              </template>
            </UiCardsGrid>
          </UiSectionWithSeeMore>
          <UiSectionWithSeeMore
            v-if="contentCount.person"
            see-more-align="end"
            :title="$t('details.mediaType.persons')"
            @on-click-see-more="() => handleTabChange('persons')"
          >
            <UiCardsGrid>
              <template v-if="!isPending">
                <PersonCard
                  v-for="item in getTmdbSearchPersonByTerm.data.value?.results.slice(0, 6)"
                  :key="item.id"
                  full-height
                  :person="item"
                />
              </template>
              <template v-else>
                <UiMediaCardSkeleton
                  v-for="index in 6"
                  :key="index"
                />
              </template>
            </UiCardsGrid>
          </UiSectionWithSeeMore>
          <UiSectionWithSeeMore
            v-if="contentCount.lists"
            see-more-align="end"
            :title="$t('details.mediaType.lists')"
            @on-click-see-more="() => handleTabChange('lists')"
          >
            <UiListsGrid>
              <template v-if="!isPending">
                <MediaListCard
                  v-for="item in getCommunityListsSearchApi.data.value?.items.slice(0, 6)"
                  :key="item.id"
                  :list="item"
                />
              </template>
              <template v-else>
                <MediaListCardSkeleton
                  v-for="index in 6"
                  :key="index"
                />
              </template>
            </UiListsGrid>
          </UiSectionWithSeeMore>
        </div>

        <template v-else>
          <SearchResultForMediaLists
            v-if="activeTab === 'lists'"
            :items="dataToRender.items as MediaListType[]"
            :is-loading="isPending"
          />
          <SearchResultForMediaItems
            v-else
            :items="dataToRender.items as TmdbSearchResponseResultItemType[]"
            :is-loading="isPending"
            :active-tab="activeTab"
          />

          <UiAttention
            v-if="!dataToRender.items?.length && !isPending"
            title-variant="text"
            :indent="0"
            :title="$t('search.notingFound')"
          />
          <SearchResultPagination
            v-model="currentPage"
            :total-pages="dataToRender.totalPage || 0"
          />
        </template>
      </template>
    </uitabspane>
  </UiContainer>
</template>

<style module lang="scss">
.wrapper {
  padding-top: 60px;

  .header {
    display: flex;
    flex-direction: column;
    gap: 16px;
    margin-bottom: 20px;
  }

  .all {
    display: flex;
    flex-direction: column;
    gap: 70px;
    margin-top: 4px;
  }
}
</style>
