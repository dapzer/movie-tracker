<script setup lang="ts">
import { ref } from "vue"
import { computed, useI18n, watch } from "#imports"
import { isOnlySpaces } from "@movie-tracker/utils"
import { useGetTmdbSearchByTermApi } from "~/api/tmdb/useTmdbApi"
import { UiCombobox, UiComboboxItem, UiComboboxSeparator } from "~/components/newUi/UiCombobox"
import { TmdbMediaTypeEnum, type TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { useRouter } from "#vue-router"
import { useLocalePath } from "#i18n"
import SearchResultMovieCardHorizontal from "~/features/search/ui/SearchResultMovieCardHorizontal.vue"
import SearchResultPersonCardHorizontal from "~/features/search/ui/SearchResultPersonCardHorizontal.vue"
import { UiMediaCardHorizontalSkeleton } from "~/components/newUi/UiCard"
import UiAttention from "../../../components/newUi/UiAttention/UiAttention.vue"

const { locale } = useI18n();
const router = useRouter()
const localePath = useLocalePath();

const searchValue = ref<string>("");
const searchTerm = ref<string>("");
const open = ref<boolean>(false);

const searchQueries = computed(() => {
  return {
    language: locale.value,
    searchValue: searchTerm.value,
    page: 1
  };
});

const tmdbGetSearchByTermApi = useGetTmdbSearchByTermApi(searchQueries);

watch(() => searchValue.value, (value, oldValue, onCleanup) => {
  if (searchValue.value == searchTerm.value) return;

  const delayDebounceFn = setTimeout(() => {
    if (isOnlySpaces(searchValue.value) && isOnlySpaces(searchTerm.value)) return;
    if (isOnlySpaces(searchValue.value)) {
      searchValue.value = "";
      searchTerm.value = "";
      return;
    }

    searchTerm.value = searchValue.value;
  }, 500);

  onCleanup(() => clearTimeout(delayDebounceFn));
});

const handleSelect = (item: TmdbSearchResponseResultItemType) => {
  router.push(localePath(`/details/${item.media_type}/${item.id}`));
  open.value = false;
};

const itemsToRender = computed(() => {
  if (!tmdbGetSearchByTermApi.data.value?.results) return [];
  return [...tmdbGetSearchByTermApi?.data.value?.results].splice(0, 5);
});
</script>

<template>
  <UiCombobox
    v-model="searchValue"
    v-model:open="open"
    :class="$style.wrapper"
    :indent="12"
    :width="568"
    align="center"
    :placeholder="$t('search.placeholder')"
    :filter-function="(items: TmdbSearchResponseResultItemType[]) => items"
  >
    <template v-if="!tmdbGetSearchByTermApi.isFetching.value">
      <template
        v-for="(item, index) in itemsToRender"
        :key="item.id"
      >
        <UiComboboxItem
          v-if="[TmdbMediaTypeEnum.MOVIE, TmdbMediaTypeEnum.TV].includes(item.media_type as
            TmdbMediaTypeEnum)"
          :as="SearchResultMovieCardHorizontal"
          :movie="item"
          :value="`${item.id}`"
          :class="$style.card"
          @select.prevent="() => handleSelect(item)"
        />
        <UiComboboxItem
          v-else
          :as="SearchResultPersonCardHorizontal"
          :person="item"
          :value="`${item.id}`"
          :class="$style.card"
          @select.prevent="() => handleSelect(item)"
        />
        <UiComboboxSeparator v-if="index < itemsToRender.length - 1" />
      </template>

      <UiAttention
        v-if="!itemsToRender.length"
        title-variant="title3"
        :indent="0"
        :title="$t('search.notingFound')"
      />
    </template>

    <template v-else>
      <template
        v-for="index in 5"
        :key="index"
      >
        <UiMediaCardHorizontalSkeleton
          :image-width="60"
        />
        <UiComboboxSeparator v-if="index < 5" />
      </template>
    </template>
  </UiCombobox>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper {
  width: 100%;
  max-width: 480px;
}

.card {
  background: none;
  max-width: unset;
  width: 100%;

  &[data-highlighted] {
    background: var(--c-card-background-hovered);
    cursor: pointer;
  }
}
</style>
