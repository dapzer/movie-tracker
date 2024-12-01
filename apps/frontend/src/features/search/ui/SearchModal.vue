<script setup lang="ts">

import { UiModalFullscreen } from "~/components/newUi/UiModal"
import { UiContainer } from "~/components/newUi/UiContainer"
import { UiDivider } from "~/components/newUi/UiDivider"
import { useSearch } from "~/features/search/model/useSearch"
import { computed, onMounted } from "#imports"
import { useRouter } from "#vue-router"
import { useLocalePath } from "#i18n"
import { TmdbMediaTypeEnum, type TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { UiInput } from "~/components/newUi/UiInput"
import { CrossIcon, SearchIcon } from "~/components/ui/icons"
import { UiButton } from "~/components/newUi/UiButton"
import SearchResultMovieCardHorizontal from "~/features/search/ui/SearchResultMovieCardHorizontal.vue"
import SearchResultPersonCardHorizontal from "~/features/search/ui/SearchResultPersonCardHorizontal.vue"
import { UiComboboxSeparator } from "~/components/newUi/UiCombobox"
import { UiMediaCardHorizontalSkeleton } from "~/components/newUi/UiCard"
import { ref, type VNodeRef } from "vue"
import { UiAttention } from "~/components/newUi/UiAttention"

const model = defineModel<boolean>()
const router = useRouter()
const localePath = useLocalePath();
const {searchValue, tmdbGetSearchByTermApi} = useSearch();
const inputRef = ref<VNodeRef | null>(null);

onMounted(() => {
  inputRef.value?.$el.focus();
});

const handleItemClick = (item: TmdbSearchResponseResultItemType) => {
  router.push(localePath(`/details/${item.media_type}/${item.id}`));
  model.value = false;
};

const itemsToRender = computed(() => {
  if (!tmdbGetSearchByTermApi.data.value?.results) return [];
  return [...tmdbGetSearchByTermApi?.data.value?.results].splice(0, 5);
});
</script>

<template>
  <UiModalFullscreen
    v-model="model"
  >
    <template #content="{closeModal}">
      <div :class="$style.wrapper">
        <UiContainer :class="$style.header">
          <UiInput
            ref="inputRef"
            v-model="searchValue"
            size="small"
            :placeholder="$t('search.placeholder')"
          >
            <template #icon>
              <SearchIcon width="20" />
            </template>
          </UiInput>
          <UiButton
            :class="$style.closeButton"
            variant="textIcon"
            @click="closeModal"
          >
            <CrossIcon width="13.75" />
          </UiButton>
        </UiContainer>

        <UiDivider />

        <UiContainer :class="$style.result">
          <template v-if="!tmdbGetSearchByTermApi.isFetching.value">
            <template
              v-for="(item, index) in itemsToRender"
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
              <UiComboboxSeparator v-if="index < itemsToRender.length - 1" />
            </template>

            <UiAttention
              v-if="!itemsToRender.length && searchValue.length"
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
        </UiContainer>
      </div>
    </template>
  </UiModalFullscreen>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper{
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
  }
}
</style>
