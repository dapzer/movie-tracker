<script setup lang="ts">
import type { MediaListType, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
// eslint-disable-next-line ts/ban-ts-comment
// @ts-expect-error
import type { SelectEvent } from "radix-vue/dist/Combobox/ComboboxItem"
import { useLocalePath } from "#i18n"
import { computed } from "#imports"
import { useRouter } from "#vue-router"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { ref } from "vue"
import { useSearch } from "~/features/search/model/useSearch"
import SearchResultMediaListCardHorizontal from "~/features/search/ui/SearchResultMediaListCardHorizontal.vue"
import SearchResultMovieCardHorizontal from "~/features/search/ui/SearchResultMovieCardHorizontal.vue"
import SearchResultPersonCardHorizontal from "~/features/search/ui/SearchResultPersonCardHorizontal.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiMediaCardHorizontalSkeleton } from "~/shared/ui/UiCard"
import { UiCombobox, UiComboboxItem, UiComboboxSeparator } from "~/shared/ui/UiCombobox"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

const router = useRouter()
const localePath = useLocalePath()

const open = ref<boolean>(false)
const { searchValue, tmdbGetSearchByTermApi, getCommunityListsSearchApi } = useSearch()

function handleSelect(url: string, event: SelectEvent) {
  if (event.detail.originalEvent.ctrlKey) {
    window.open(localePath(url), "_blank")
    return
  }
  router.push(localePath(url))
  open.value = false
}

function handleSelectMedia(item: TmdbSearchResponseResultItemType, event: SelectEvent) {
  handleSelect(`/details/${item.media_type}/${item.id}`, event)
}

function handleSelectList(item: MediaListType, event: SelectEvent) {
  handleSelect(`/lists/details/${item.id}`, event)
}

function handleOpenSearchPage(event: SelectEvent) {
  handleSelect(`/search?searchTerm=${searchValue.value}`, event)
}

const listsToRender = computed(() => {
  if (!getCommunityListsSearchApi.data.value?.items)
    return []
  return [...getCommunityListsSearchApi?.data.value?.items].splice(0, 2)
})

const itemsToRender = computed(() => {
  if (!tmdbGetSearchByTermApi.data.value?.results)
    return []
  return [...tmdbGetSearchByTermApi?.data.value?.results].splice(0, 5 - listsToRender.value.length)
})

const isLoading = computed(() => {
  return tmdbGetSearchByTermApi.isFetching.value || getCommunityListsSearchApi.isFetching.value
})
</script>

<template>
  <UiCombobox
    v-model="searchValue"
    v-model:open="open"
    :class="$style.wrapper"
    :content-class="$style.content"
    :indent="12"
    :width="568"
    align="center"
    :reset-search-term-on-blur="false"
    :placeholder="$t('search.placeholder')"
    :filter-function="(items: TmdbSearchResponseResultItemType[]) => items"
  >
    <template v-if="!isLoading">
      <template
        v-for="(item) in itemsToRender"
        :key="item.id"
      >
        <UiComboboxItem
          v-if="[TmdbMediaTypeEnum.MOVIE, TmdbMediaTypeEnum.TV].includes(item.media_type as
            TmdbMediaTypeEnum)"
          :as="SearchResultMovieCardHorizontal"
          :movie="item"
          :value="`${item.id}`"
          :class="$style.card"
          @select.prevent="(event: SelectEvent) => handleSelectMedia(item, event)"
        />
        <UiComboboxItem
          v-else
          :as="SearchResultPersonCardHorizontal"
          :person="item"
          :value="`${item.id}`"
          :class="$style.card"
          @select.prevent="(event: SelectEvent) => handleSelectMedia(item, event)"
        />
        <UiComboboxSeparator />
      </template>

      <template
        v-for="(item) in listsToRender"
        :key="item.id"
      >
        <UiComboboxItem
          v-if="listsToRender.length"
          :as="SearchResultMediaListCardHorizontal"
          :list="item"
          :value="item.id"
          :class="$style.card"
          @select.prevent="(event: SelectEvent) => handleSelectList(item, event)"
        />
        <UiComboboxSeparator />
      </template>

      <UiComboboxItem
        v-if="itemsToRender.length"
        :class="[$style.card, $style.seeAllResults]"
        value="link"
        :as="UiTypography"
        schema="link"
        @select.prevent="(event: SelectEvent) => handleOpenSearchPage(event)"
      >
        {{ $t("search.seeAllResults", { searchTerm: searchValue }) }}
        <UiIcon
          :size="18"
          name="icon:arrow-right-bold"
        />
      </UiComboboxItem>

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
@import "~/shared/styles/mixins";

.wrapper {
  width: 100%;
  max-width: 480px;
}

.content {
  padding: 0;
  gap: 0;
}

.seeAllResults {
  padding: 8px;
  display: flex;
  align-items: center;
  gap: 2px;
}

.card {
  background: none;
  max-width: unset;
  width: 100%;
  padding: 12px;

  &[data-highlighted] {
    background: var(--c-card-background-hovered);
    cursor: pointer;
  }
}
</style>
