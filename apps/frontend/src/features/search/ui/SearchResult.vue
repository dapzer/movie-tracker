<script setup lang="ts">
import { useRoute } from "#vue-router"
import { useI18n } from "#imports"
import { computed, ref, watch } from "vue"
import {
  useGetTmdbSearchMovieByTermApi,
  useGetTmdbSearchPersonByTermApi,
  useGetTmdbSearchTvByTermApi
} from "~/api/tmdb/useTmdbApi"
import { UiContainer } from "~/components/ui/UiContainer"
import { UiTypography } from "~/components/ui/UiTypography"
import { UiDivider } from "~/components/ui/UiDivider"
import { UiTabsPane } from "~/components/ui/UiTabs"
import { UiSectionWithSeeMore } from "~/components/ui/UiSectionWithSeeMore"
import { UiCardsGrid } from "~/components/ui/UiCardsGrid"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import { PersonCard } from "~/entities/personCard"
import { MediaTypeEnum } from "@movie-tracker/types"
import SearchResultPagination from "~/features/search/ui/SearchResultPagination.vue"
import { UiMediaCardSkeleton } from "~/components/ui/UiCard"
import { useRouter } from "vue-router"
import { UiAttention } from "~/components/ui/UiAttention"
import { getMatchesDeclensionTranslationKey } from "~/utils/getMatchesDeclensionTranslationKey"

type Tab = 'all' | 'movies' | 'tvs' | 'parsons'

const { locale, t } = useI18n();

const route = useRoute();
const router = useRouter()
const searchTerm = ref(route.query.searchTerm as string)

watch(() => route.query.searchTerm, () => {
  if ('searchTerm' in route.query) {
    searchTerm.value = route.query.searchTerm as string
  }
})

const activeTab = ref<Tab>(route.query.activeTab?.toString() as Tab || 'all')
const currentPage = ref(Number(route.query.page || 1))

const updateQueryParams = () => {
  router.push({
    query: {
      searchTerm: searchTerm.value,
      activeTab: activeTab.value,
      page: currentPage.value
    }
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
  page: currentPage.value
}))

const getTmdbSearchMovieByTerm = useGetTmdbSearchMovieByTermApi(searchQueries)
const getTmdbSearchTvByTerm = useGetTmdbSearchTvByTermApi(searchQueries)
const getTmdbSearchPersonByTerm = useGetTmdbSearchPersonByTermApi(searchQueries)

await Promise.all([
  getTmdbSearchMovieByTerm.suspense(),
  getTmdbSearchTvByTerm.suspense(),
  getTmdbSearchPersonByTerm.suspense()
])

const contentCount = {
  movie: getTmdbSearchMovieByTerm.data.value?.total_results || 0,
  tv: getTmdbSearchTvByTerm.data.value?.total_results || 0,
  person: getTmdbSearchPersonByTerm.data.value?.total_results || 0,
  get total()  {
    return this.movie + this.tv + this.person
  }
}

const dataToRender = computed(() => {
  if (activeTab.value === 'movies') {
    return {
      items:getTmdbSearchMovieByTerm.data.value?.results,
      totalPage: getTmdbSearchMovieByTerm.data.value?.total_pages
    }
  }

  if (activeTab.value === 'tvs') {
    return {
      items:getTmdbSearchTvByTerm.data.value?.results,
      totalPage: getTmdbSearchTvByTerm.data.value?.total_pages
    }
  }

  if (activeTab.value === 'parsons') {
    return {
      items:getTmdbSearchPersonByTerm.data.value?.results,
      totalPage: getTmdbSearchPersonByTerm.data.value?.total_pages
    }
  }

  return {
    items: [],
    totalPage: 0
  }
})

const isPending = computed(() => {
  return getTmdbSearchMovieByTerm.isPending.value ||
    getTmdbSearchTvByTerm.isPending.value ||
    getTmdbSearchPersonByTerm.isPending.value
})

const handleTabChange = (tab: Tab) => {
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
            searchTerm: searchTerm
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
          key: 'parsons',
        }
      ] as const"
    >
      <template #content>
        <div
          v-if="activeTab ==='all'"
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
              <MovieCardWithHoverMenu
                v-for="item in getTmdbSearchMovieByTerm.data.value?.results.slice(0, 6)"
                :key="item.id"
                :movie="{...item, media_type: MediaTypeEnum.MOVIE}"
              />
            </UiCardsGrid>
          </UiSectionWithSeeMore>
          <UiSectionWithSeeMore
            v-if="contentCount.tv"
            see-more-align="end"
            :title="$t('details.mediaType.tvs')"
            @on-click-see-more="() => handleTabChange('tvs')"
          >
            <UiCardsGrid>
              <MovieCardWithHoverMenu
                v-for="item in getTmdbSearchTvByTerm.data.value?.results.slice(0, 6)"
                :key="item.id"
                :movie="{...item, media_type: MediaTypeEnum.TV}"
              />
            </UiCardsGrid>
          </UiSectionWithSeeMore>
          <UiSectionWithSeeMore
            v-if="contentCount.person"
            see-more-align="end"
            :title="$t('details.mediaType.persons')"
            @on-click-see-more="() => handleTabChange('parsons')"
          >
            <UiCardsGrid>
              <PersonCard
                v-for="item in getTmdbSearchPersonByTerm.data.value?.results.slice(0, 6)"
                :key="item.id"
                :person="item"
              />
            </UiCardsGrid>
          </UiSectionWithSeeMore>
        </div>
        <template v-else>
          <UiCardsGrid>
            <template v-if="isPending">
              <UiMediaCardSkeleton
                v-for="index in 20"
                :key="index"
              />
            </template>
            <template v-else-if="activeTab !== 'parsons'">
              <MovieCardWithHoverMenu
                v-for="item in dataToRender.items"
                :key="item.id"
                :movie="{...item, media_type: activeTab === 'movies' ? MediaTypeEnum.MOVIE : MediaTypeEnum.TV}"
              />
            </template>
            <template v-else>
              <PersonCard
                v-for="item in dataToRender.items"
                :key="item.id"
                :person="item"
              />
            </template>
          </UiCardsGrid>
          <UiAttention
            v-if="!dataToRender.items?.length"
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
