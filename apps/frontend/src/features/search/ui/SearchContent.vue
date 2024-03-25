<script lang="ts" setup>
import { computed, useI18n, watch } from "#imports";
import { searchStore } from "~/stores/searcStore";
import { useRouter } from "vue-router";
import UiPagination from "~/components/ui/UiPagination.vue";
import { SearchField, SearchResult } from "~/features/search";
import UiContainer from "~/components/ui/UiContainer.vue";
import { ref, type VNodeRef } from "vue";
import { isOnlySpaces } from "@movie-tracker/utils";
import { useTmdbGetSearchByTermApi } from "~/api/tmdb/useTmdbApi";

const searchTerm = computed(() => searchStore.state.searchValue);
const currentPage = computed(() => searchStore.state.currentPage);
const searchFieldRef = ref<VNodeRef | null>(null);
const { locale } = useI18n();
const router = useRouter();

const searchQueries = computed(() => {
  return {
    language: locale.value,
    searchValue: searchTerm.value,
    page: currentPage.value
  };
});

const tmdbGetSearchByTermApi = useTmdbGetSearchByTermApi(searchQueries);

watch(() => tmdbGetSearchByTermApi.data.value, (value, oldValue, onCleanup) => {
  if (tmdbGetSearchByTermApi.isSuccess.value && searchFieldRef.value && tmdbGetSearchByTermApi.data.value?.results.length) {
    const timeout = setTimeout(() => {
      searchFieldRef.value.$el.scrollIntoView({ behavior: "smooth", block: "start", inline: "nearest" });
    }, 0);

    onCleanup(() => clearTimeout(timeout));
  }
}, { immediate: true });

const handleCurrentPage = (page: number) => {
  searchStore.handleCurrentPage(page);
  router.push({
    query: {
      search: searchTerm.value,
      page
    }
  });
};
</script>

<template>
  <UiContainer as="section">
    <div :class="$style.wrapper">
      <SearchField ref="searchFieldRef" />
      <SearchResult
        v-if="searchTerm && !isOnlySpaces(searchTerm)"
        :is-loading="tmdbGetSearchByTermApi.isLoading.value"
        :search-result="tmdbGetSearchByTermApi.data.value"
      />
      <UiPagination
        v-if="!tmdbGetSearchByTermApi.isLoading.value && !!tmdbGetSearchByTermApi.data?.value?.total_results"
        :current-page="currentPage"
        :options="{ pageToShow: 5, pagesOnSides: 2 }"
        :total-pages="tmdbGetSearchByTermApi.data.value?.total_pages || 0"
        @change-page="handleCurrentPage"
      />
    </div>
  </UiContainer>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  margin-top: 32px;
}
</style>
