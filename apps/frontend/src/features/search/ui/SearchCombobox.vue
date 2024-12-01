<script setup lang="ts">
import { ref } from "vue"
import { computed } from "#imports"
import { UiCombobox, UiComboboxItem, UiComboboxSeparator } from "~/components/newUi/UiCombobox"
import { TmdbMediaTypeEnum, type TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { useRouter } from "#vue-router"
import { useLocalePath } from "#i18n"
import SearchResultMovieCardHorizontal from "~/features/search/ui/SearchResultMovieCardHorizontal.vue"
import SearchResultPersonCardHorizontal from "~/features/search/ui/SearchResultPersonCardHorizontal.vue"
import { UiMediaCardHorizontalSkeleton } from "~/components/newUi/UiCard"
import UiAttention from "../../../components/newUi/UiAttention/UiAttention.vue"
import { useSearch } from "~/features/search/model/useSearch"

const router = useRouter()
const localePath = useLocalePath();

const open = ref<boolean>(false);
const {searchValue, tmdbGetSearchByTermApi} = useSearch();

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
        title-variant="text"
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
