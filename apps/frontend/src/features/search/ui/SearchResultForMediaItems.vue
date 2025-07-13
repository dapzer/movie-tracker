<script setup lang="ts">
import type { TmdbSearchResponseResultItemType } from "@movie-tracker/types"
import { MediaTypeEnum } from "@movie-tracker/types"
import { PersonCard } from "~/entities/personCard"
import { MovieCardWithHoverMenu } from "~/features/movieCardWithHoverMenu"
import { UiMediaCardSkeleton } from "~/shared/ui/UiCard"
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"

interface SearchResultForMediaItemsProps {
  items: TmdbSearchResponseResultItemType[]
  isLoading: boolean
  activeTab: string
}

const props = defineProps<SearchResultForMediaItemsProps>()
</script>

<template>
  <UiCardsGrid>
    <template v-if="props.isLoading">
      <UiMediaCardSkeleton
        v-for="index in 20"
        :key="index"
      />
    </template>
    <template v-else>
      <template v-if="activeTab !== 'persons'">
        <MovieCardWithHoverMenu
          v-for="item in props.items"
          :key="item.id"
          :movie="{ ...item, media_type: activeTab === 'movies' ? MediaTypeEnum.MOVIE : MediaTypeEnum.TV }"
        />
      </template>
      <template v-else>
        <PersonCard
          v-for="item in props.items"
          :key="item.id"
          :person="item"
        />
      </template>
    </template>
  </UiCardsGrid>
</template>

<style scoped lang="scss">

</style>
