<script lang="ts" setup>

import UiTypography from "~/components/ui/UiTypography.vue";
import { MediaTypeEnum, type TmdbSearchResponseType } from "@movie-tracker/types";
import { UiCardSkeleton } from "~/components/ui/UiCard";
import { PersonCard } from "~/entities/personCard";
import { MovieCard } from "~/entities/movieCard"

interface SearchResultProps {
  searchResult?: TmdbSearchResponseType | null;
  isLoading?: boolean;
}

const props = defineProps<SearchResultProps>();
</script>

<template>
  <div :class="$style.wrapper">
    <template v-if="!props.isLoading">
      <UiTypography
        v-if="!!props.searchResult?.total_results"
        variant="title3"
      >
        {{ $t("search.totalResults") }}: {{ props.searchResult?.total_results ?? 0 }}
      </UiTypography>
      <UiTypography
        v-else
        variant="title3"
      >
        {{ $t("search.notingFound") }}
      </UiTypography>
    </template>
    <MasonryWall
      v-if="props.searchResult?.total_results && !props.isLoading"
      :column-width="260"
      :gap="20"
      :items="props.searchResult?.results"
      :max-columns="4"
      :ssr-columns="4"
    >
      <template #default="{ item }">
        <!-- @vue-skip -->
        <MovieCard
          v-if="item.media_type === MediaTypeEnum.MOVIE || item.media_type === MediaTypeEnum.TV"
          :movie="item"
        />
        <PersonCard
          v-else
          :person="item"
        />
      </template>
    </MasonryWall>


    <MasonryWall
      v-if="props.isLoading"
      :column-width="260"
      :gap="20"
      :items="Array(20).fill('_')"
      :max-columns="4"
      :ssr-columns="4"
    >
      <template #default>
        <UiCardSkeleton />
      </template>
    </MasonryWall>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
