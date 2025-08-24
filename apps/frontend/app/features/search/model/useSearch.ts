import { useI18n } from "#imports"
import { isOnlySpaces } from "@movie-tracker/utils"
import { computed, ref, watch } from "vue"
import { useGetCommunityListsSearchApi } from "~/api/communityLists/useCommunityListsApi"
import { useGetTmdbSearchByTermApi } from "~/api/tmdb/useTmdbApi"

export function useSearch() {
  const { locale } = useI18n()

  const searchValue = ref<string>("")
  const searchTerm = ref<string>("")

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

  watch(() => searchValue.value, (value, oldValue, onCleanup) => {
    if (searchValue.value === searchTerm.value)
      return

    const delayDebounceFn = setTimeout(() => {
      if (isOnlySpaces(searchValue.value) && isOnlySpaces(searchTerm.value))
        return
      if (isOnlySpaces(searchValue.value)) {
        searchValue.value = ""
        searchTerm.value = ""
        return
      }

      searchTerm.value = searchValue.value
    }, 500)

    onCleanup(() => clearTimeout(delayDebounceFn))
  })

  return {
    searchValue,
    tmdbGetSearchByTermApi,
    searchQueries,
    getCommunityListsSearchApi,
  }
}
