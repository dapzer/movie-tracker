<script generic="T" setup lang="ts">
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
</script>

<template>
  <UiSectionWithSeeMore
    title-as="h2"
    :title="props.title"
    see-more-align="end"
    :see-more-url="props.seeMoreUrl"
  >
    <FeedSlider
      :buttons-top-offset="142"
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
  </UiSectionWithSeeMore>
</template>

<style module lang="scss">
</style>
