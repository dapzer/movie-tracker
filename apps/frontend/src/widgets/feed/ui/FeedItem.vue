<script generic="T" setup lang="ts">
import { UiSlider } from "../../../shared/ui/UiSlider"
import { UiCardsGrid } from "../../../shared/ui/UiCardsGrid"
import { UiSectionWithSeeMore } from "../../../shared/ui/UiSectionWithSeeMore"

interface FeedItemProps<T> {
  data: T[] | undefined;
  title: string;
  seeMoreUrl: string;
  isLoading?: boolean;
  slideWidth?: number;
  sliderWithShadow?: boolean;
}

const props = defineProps<FeedItemProps<T>>()
const loadingArray = Array.from({ length: 20 }, (_, i) => i);
</script>

<template>
  <UiSectionWithSeeMore
    :title="props.title"
    :class="$style.wrapper"
    see-more-align="end"
    :see-more-url="props.seeMoreUrl"
  >
    <UiSlider
      :buttons-top-offset="142"
      :class="$style.slider"
      :data="isLoading ? loadingArray as T[] : props.data as T[]"
      :maxWidth="props.slideWidth"
      :withShadow="props.sliderWithShadow"
    >
      <template
        v-if="!isLoading"
        #slide="{ item }"
      >
        <slot
          name="slide"
          :item="item"
        />
      </template>
      <template
        v-else
        #slide
      >
        <slot name="skeleton" />
      </template>
    </UiSlider>

    <UiCardsGrid :class="$style.grid">
      <template v-if="!isLoading">
        <slot
          v-for="item in props.data as T[]"
          name="slide"
          :item="item"
        />
      </template>
      <template v-else>
        <slot
          v-for="(_, index) in loadingArray"
          :key="index"
          name="skeleton"
        />
      </template>
    </UiCardsGrid>
  </UiSectionWithSeeMore>
</template>

<style module lang="scss">
@import "~/styles/mixins";
@import "~/styles/variables";

.wrapper {
  .grid {
    display: none;
  }

  @include mobileDevice {
    .slider {
      display: none;
    }

    .grid {
      display: grid;
    }
  }
}
</style>
