import { reactive, readonly } from "vue";

const state = reactive({
  searchValue: "",
  currentPage: 1
});

const handleCurrentPage = (page: number) => {
  state.currentPage = page;
};

const onChangeSearch = (value: string) => {
  state.searchValue = value;
};

export const searchStore = {
  state: readonly(state),
  handleCurrentPage,
  onChangeSearch
};
