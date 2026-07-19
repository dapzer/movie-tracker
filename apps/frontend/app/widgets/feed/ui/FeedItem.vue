<script generic="T" setup lang="ts">
import { UiCardsGrid } from "~/shared/ui/UiCardsGrid"
import { UiSectionWithSeeMore } from "~/shared/ui/UiSectionWithSeeMore"
import FeedSlider from "~/widgets/feed/ui/FeedSlider.vue"

interface FeedItemProps<T> {
  data: T[] | undefined
  title: string
  seeMoreUrl: string
  isLoading: boolean
  slideWidth: number
  sliderWithShadow?: boolean
}

const props = defineProps<FeedItemProps<T>>()
const loadingArray = Array.from({ length: 20 }, (_, i) => i)
</script>

<template>
  <UiSectionWithSeeMore
    title-as="h2"
    :title="props.title"
    :class="$style.wrapper"
    see-more-align="end"
    :see-more-url="props.seeMoreUrl"
  >
    <FeedSlider
      :buttons-top-offset="142"
      :class="$style.slider"
      :data="props.data"
      :slide-width="props.slideWidth"
      :with-shadow="props.sliderWithShadow"
      :is-loading="isLoading"
      :skeletons-count="20"
    >
      <template
        #slide="{ item }"
      >
        <slot
          name="slide"
          :item="item"
        />
      </template>
      <template
        #skeleton
      >
        <slot name="skeleton" />
      </template>
    </FeedSlider>

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
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";

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
