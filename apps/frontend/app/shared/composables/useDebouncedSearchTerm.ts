import type { Ref } from "vue"
import { isOnlySpaces } from "@movie-tracker/utils"
import { ref, watch } from "vue"

export function useDebouncedSearchTerm(searchTerm: Ref<string>) {
  const searchValue = ref<string>("")

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
  }
}
