<script lang="ts" setup>
import { Hero } from "~/widgets/hero";
import UiContainer from "~/components/ui/UiContainer.vue";
import { SearchField } from "~/features/search";
import UiPagination from "~/components/ui/UiPagination.vue";
import { ref } from "vue";
import { searchStore } from "~/stores/searcStore";
import { useRouter } from "vue-router";

const router = useRouter();

const handleCurrentPage = (page: number) => {
  searchStore.handleCurrentPage(page);
  router.push({
    query: {
      search: searchStore.state.searchValue,
      page
    }
  })
}
</script>

<template>
  <Hero />
  <UiContainer>
    <SearchField />
    <UiPagination
      :current-page="searchStore.state.currentPage"
      :options="{ pageToShow: 5, pagesOnSides: 2 }"
      :total-pages="10"
      @changePage="handleCurrentPage"
    />
  </UiContainer>
</template>

<style lang="scss" module></style>
