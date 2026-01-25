import { useI18n } from "#imports"
import { computed, ref } from "vue"
import { useGetCommunityListsSearchApi } from "~/api/communityLists/useCommunityListsApi"
import { useGetTmdbSearchByTermApi } from "~/api/tmdb/useTmdbApi"
import { useDebouncedSearchTerm } from "~/shared/composables/useDebouncedSearchTerm"

export function useSearch() {
  const { locale } = useI18n()

  const searchTerm = ref<string>("")
  const { searchValue } = useDebouncedSearchTerm(searchTerm)

  const searchQueries = computed(() => {
    return {
      language: locale.value,
      searchValue: searchTerm.value,
      page: 1,
    }
  })

  const tmdbGetSearchByTermApi = useGetTmdbSearchByTermApi(searchQueries)

  const getCommunityListsSearchApiQueries = computed(() => ({
    limit: 2,
    offset: 0,
    title: searchTerm.value,
  }))

  const getCommunityListsSearchApi = useGetCommunityListsSearchApi(getCommunityListsSearchApiQueries)

  const isResultsEmpty = computed(() => {
    return (getCommunityListsSearchApi.data.value?.items.length || 0) === 0
      && (tmdbGetSearchByTermApi.data.value?.results.length || 0) === 0
  })

  const isLoading = computed(() => {
    return tmdbGetSearchByTermApi.isFetching.value || getCommunityListsSearchApi.isFetching.value
  })

  return {
    searchValue,
    tmdbGetSearchByTermApi,
    searchQueries,
    getCommunityListsSearchApi,
    isResultsEmpty,
    isLoading,
  }
}
