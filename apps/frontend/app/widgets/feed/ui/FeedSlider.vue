<script setup generic="T" lang="ts">
import { computed } from "vue"
import { UiSlider } from "~/shared/ui/UiSlider"

interface FeedSlider<T> {
  data: T[] | undefined
  isLoading: boolean
  slideWidth: number
  sliderWithShadow?: boolean
  buttonsTopOffset?: number
  skeletonsCount: number
}

const props = defineProps<FeedSlider<T>>()

const loadingArray = Array.from({ length: props.skeletonsCount }, (_, i) => i)
const dataToRender = computed(() => {
  return props.isLoading ? loadingArray as T[] : props.data as T[]
})
</script>

<template>
  <UiSlider
    :buttons-top-offset="props.buttonsTopOffset"
    :data="dataToRender"
    :max-width="props.slideWidth"
    :with-shadow="props.sliderWithShadow"
  >
    <template
      v-if="!props.isLoading"
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
</template>
