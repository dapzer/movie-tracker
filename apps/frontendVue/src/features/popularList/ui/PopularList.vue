<script lang="ts" setup>
import { TmdbMediaTypeEnum } from "@movie-tracker/types";
import { useTmdbGetPopularList } from "~/composables/useTmdbApi";
import { computed } from "vue";
import { useI18n } from "#imports";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiListWithShowMore from "~/components/ui/UiListWithShowMore.vue";
import { UiCardSkeleton } from "~/components/ui/UiCard";
import { MovieCard } from "~/widgets/movieCard";

interface PopularListProps {
  mediaType: TmdbMediaTypeEnum;
  title: string;
}

const props = defineProps<PopularListProps>();
const { locale } = useI18n();

const queries = computed(() => {
  return {
    language: locale.value,
    mediaType: props.mediaType
  };
});

const { data: popular, isLoading: isPopularLoading } = useTmdbGetPopularList(queries);
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      as="h2"
      variant="title2"
    >
      {{ props.title }}
    </UiTypography>

    <UiListWithShowMore
      v-if="isPopularLoading"
      variant="smallColumns"
      :title="props.title"
      :items-to-show="6"
      :items="Array(6).fill('_')"
      is-hide-show-more
    >
      <template #card>
        <UiCardSkeleton
          is-small
        />
      </template>
    </UiListWithShowMore>

    <UiListWithShowMore
      v-else-if="popular"
      variant="smallColumns"
      :title="props.title"
      :items-to-show="5"
      :items="popular.results"
    >
      <template #card="{ item: movie, isFromModal }">
        <MovieCard
          :key="movie.id"
          :movie="{...movie, media_type: props.mediaType}"
          :is-small="!isFromModal"
          :is-hide-media-list-selector="!isFromModal"
        />
      </template>
    </UiListWithShowMore>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
}
</style>
