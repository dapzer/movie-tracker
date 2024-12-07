<script generic="T" setup lang="ts">
import { UiSlider } from "~/components/ui/UiSlider"
import { UiCardsGrid } from "~/components/ui/UiCardsGrid"
import { UiSectionWithSeeMore } from "~/components/ui/UiSectionWithSeeMore"

interface FeedItemProps<T> {
  data: T[] | undefined;
  title: string;
  seeMoreUrl: string;
  slideWidth?: number;
  sliderWithShadow?: boolean;
}

const props = defineProps<FeedItemProps<T>>()

</script>

<template>
  <UiSectionWithSeeMore
    :title="props.title"
    :class="$style.wrapper"
    see-more-align="end"
    :see-more-url="props.seeMoreUrl"
  >
    <UiSlider
      :class="$style.slider"
      :data="props.data as T[]"
      :maxWidth="props.slideWidth"
      :withShadow="props.sliderWithShadow"
    >
      <template #slide="{ item }">
        <slot
          name="slide"
          :item="item"
        />
      </template>
    </UiSlider>

    <UiCardsGrid :class="$style.grid">
      <slot
        v-for="item in props.data as T[]"
        name="slide"
        :item="item"
      />
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
