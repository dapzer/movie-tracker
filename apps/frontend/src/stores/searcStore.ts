import { reactive, readonly } from "vue"

const state = reactive({
  searchValue: "",
  currentPage: 1,
})

function handleCurrentPage(page: number) {
  state.currentPage = page
}

function onChangeSearch(value: string) {
  state.searchValue = value
}

export const searchStore = {
  state: readonly(state),
  handleCurrentPage,
  onChangeSearch,
}
