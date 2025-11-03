<script setup lang="ts">
import type { MediaListType, TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import type { VNodeRef } from "vue"
import { useLocalePath } from "#i18n"
import { computed, onMounted } from "#imports"
import { useRouter } from "#vue-router"
import { TmdbMediaTypeEnum } from "@movie-tracker/types"
import { ref } from "vue"
import { useSearch } from "~/features/search/model/useSearch"
import SearchResultMediaListCardHorizontal from "~/features/search/ui/SearchResultMediaListCardHorizontal.vue"
import SearchResultMovieCardHorizontal from "~/features/search/ui/SearchResultMovieCardHorizontal.vue"
import SearchResultPersonCardHorizontal from "~/features/search/ui/SearchResultPersonCardHorizontal.vue"
import { UiAttention } from "~/shared/ui/UiAttention"
import { UiButton } from "~/shared/ui/UiButton"
import { UiMediaCardHorizontalSkeleton } from "~/shared/ui/UiCard"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiInput } from "~/shared/ui/UiInput"
import { UiModalFullscreen } from "~/shared/ui/UiModal"
import { UiTypography } from "~/shared/ui/UiTypography"

const model = defineModel<boolean>()
const router = useRouter()
const localePath = useLocalePath()
const { searchValue, tmdbGetSearchByTermApi, getCommunityListsSearchApi, isLoading, isResultsEmpty } = useSearch()
const inputRef = ref<VNodeRef | null>(null)

onMounted(() => {
  inputRef.value?.$el.focus()
})

function handleItemClick(item: TmdbSearchResponseResultItemType) {
  router.push(localePath(`/details/${item.media_type}/${item.id}`))
  model.value = false
}

function handleSelectList(item: MediaListType) {
  router.push(localePath(`/lists/details/${item.id}`))
  model.value = false
}

function handleOpenSearchPage() {
  router.push(localePath(`/search?searchTerm=${searchValue.value}`))
  model.value = false
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
</script>

<template>
  <UiModalFullscreen
    v-model="model"
  >
    <template #content="{ closeModal }">
      <div :class="$style.wrapper">
        <UiContainer :class="$style.header">
          <UiInput
            ref="inputRef"
            v-model="searchValue"
            size="small"
            :placeholder="$t('search.placeholder')"
          >
            <template #icon>
              <UiIcon
                name="icon:search"
                :size="16"
              />
            </template>
          </UiInput>
          <UiButton
            :class="$style.closeButton"
            variant="textIcon"
            @click="closeModal"
          >
            <UiIcon
              name="icon:cross"
              :size="13.75"
            />
          </UiButton>
        </UiContainer>

        <UiDivider />

        <UiContainer :class="$style.result">
          <template v-if="!isLoading">
            <template
              v-for="(item) in itemsToRender"
              :key="item.id"
            >
              <SearchResultMovieCardHorizontal
                v-if="[TmdbMediaTypeEnum.MOVIE, TmdbMediaTypeEnum.TV].includes(item.media_type as
                  TmdbMediaTypeEnum)"
                :movie="item"
                :class="$style.card"
                @click="() => handleItemClick(item)"
              />
              <SearchResultPersonCardHorizontal
                v-else
                :person="item"
                :class="$style.card"
                @click="() => handleItemClick(item)"
              />
              <UiDivider />
            </template>

            <template
              v-for="(item) in listsToRender"
              :key="item.id"
            >
              <SearchResultMediaListCardHorizontal
                :list="item"
                :class="[$style.card, $style.listCard]"
                @click="() => handleSelectList(item)"
              />
              <UiDivider />
            </template>

            <UiTypography
              v-if="!isResultsEmpty"
              :class="[$style.card, $style.seeAllResults]"
              schema="link"
              @click="() => handleOpenSearchPage()"
            >
              {{ $t("search.seeAllResults", { searchTerm: searchValue }) }}
              <UiIcon
                :size="18"
                name="icon:arrow-right-bold"
              />
            </UiTypography>

            <UiAttention
              v-if="isResultsEmpty && searchValue.length"
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
              <UiDivider v-if="index < 5" />
            </template>
          </template>
        </UiContainer>
      </div>
    </template>
  </UiModalFullscreen>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  height: 100%;
  display: flex;
  flex-direction: column;
  gap: 12px;
  padding: 12px 0;

  .header {
    height: calc(var(--s-header-height) - 24px);
    display: flex;
    align-items: center;
    gap: 10px;

    .closeButton {
      width: 32px;
      height: 32px;
    }
  }

  .seeAllResults {
    padding: 8px;
    display: flex;
    align-items: center;
    gap: 2px;
  }

  .result {
    overflow: auto;
    @include scrollbar();
    display: flex;
    flex-direction: column;
    gap: 8px;
    margin-top: 4px;

    .card {
      cursor: pointer;
    }

    .listCard {
      padding: 8px;
    }
  }
}
</style>
