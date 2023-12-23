<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import UiInput from "~/components/ui/UiInput.vue";
import { CloseIcon, SearchIcon } from "~/components/ui/icons";
import UiButton from "~/components/ui/UiButton.vue";
import { ref } from "vue";
import { computed, onBeforeMount, onMounted, watch } from "#imports";
import { useRoute, useRouter } from "vue-router";
import { isOnlySpaces } from "@movie-tracker/utils";
import { searchStore } from "~/stores/searcStore";

const router = useRouter();
const route = useRoute();
const localSearchValue = ref<string>("");
const searchValue = computed(() => searchStore.state.searchValue);
const currentPage = computed(() => searchStore.state.currentPage);

onMounted(() => {
  if (route.query.search) {
    localSearchValue.value = route.query.search as string;
    searchStore.onChangeSearch(route.query.search as string);
  }

  if (route.query.page) {
    searchStore.handleCurrentPage(parseInt(route.query.page as string));
  }

  if (searchValue.value) {
    updateSearchData(searchValue.value, currentPage.value);
    localSearchValue.value = searchValue.value;
  }
});

const updateSearchData = (searchValue: string, currentPage: number) => {
  router.push({
    query: {
      search: searchValue,
      page: currentPage
    }
  });
  searchStore.onChangeSearch(searchValue);
  searchStore.handleCurrentPage(currentPage);
};

const clearSearchData = () => {
  router.push({
    query: {}
  });
  searchStore.onChangeSearch("");
  searchStore.handleCurrentPage(1);
};

const clearSearch = () => {
  clearSearchData();
  localSearchValue.value = "";
};

watch(() => localSearchValue.value, (value, oldValue, onCleanup) => {
  if (localSearchValue.value == searchValue.value) return;

  const delayDebounceFn = setTimeout(() => {
    if (isOnlySpaces(localSearchValue.value) && isOnlySpaces(searchValue.value)) return;
    if (isOnlySpaces(localSearchValue.value)) return clearSearchData();
    updateSearchData(localSearchValue.value, 1);
  }, 500);

  onCleanup(() => clearTimeout(delayDebounceFn));
});
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      as="h3"
      variant="title3"
    >
      {{ $t("search.title") }}
    </UiTypography>

    <div :class="$style.content">
      <SearchIcon :class="$style.searchIcon" />
      <UiInput
        v-model="localSearchValue"
        :class="$style.input"
        :placeholder="$t('search.placeholder')"
        type="text"
      />
      <UiButton
        v-if="searchValue"
        :class="$style.clearIcon"
        variant="clear"
        @click="clearSearch"
      >
        <CloseIcon />
      </UiButton>
    </div>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .content {
    position: relative;

    .input {
      width: 100%;
      border-radius: 50px;
      padding-left: 55px;
    }

    .searchIcon {
      position: absolute;
      left: 20px;
      top: 50%;
      transform: translateY(-50%) rotate(90deg);
      width: 25px;
      height: 25px;
      color: var(--c-text);
    }

    .clearIcon {
      position: absolute;
      display: flex;
      align-items: center;
      justify-content: center;
      right: 20px;
      top: 50%;
      transform: translateY(-50%);
      width: 16px;
      height: 16px;
      color: var(--c-text);
    }
  }
}
</style>
