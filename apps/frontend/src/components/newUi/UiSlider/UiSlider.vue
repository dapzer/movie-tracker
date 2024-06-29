<script generic="T" setup lang="ts">
import { UiButton } from "~/components/newUi/UiButton"
import { ref } from "vue"
import { watchEffect } from "#imports"
import { ArrowRightIcon } from "~/components/ui/icons"
import emblaCarouselVue from "embla-carousel-vue"

interface UiSliderProps<T> {
  data: T[]
  maxWidth: number
}

const props = defineProps<UiSliderProps<T>>()

const [emblaRef, emblaApi] = emblaCarouselVue()
const prevBtnDisabled = ref(false)
const nextBtnDisabled = ref(false)

const onSlideChange = () => {
  if (!emblaApi.value) return

  nextBtnDisabled.value = !emblaApi.value.canScrollNext()
  prevBtnDisabled.value = !emblaApi.value.canScrollPrev()
}

watchEffect(() => {
  if (!emblaApi.value) return

  onSlideChange()
  emblaApi.value?.on('reInit', onSlideChange).on('select', onSlideChange)
})

const onPrevButtonClick = () => {
  if (!emblaApi) return
  emblaApi?.value?.scrollPrev()
}

const onNextButtonClick = () => {
  if (!emblaApi) return
  emblaApi?.value?.scrollNext()
}
</script>

<template>
  <div
    ref="emblaRef"
    class="embla"
  >
    <div class="embla__container">
      <div
        v-for="(item, index) in props.data"
        :key="index"
        class="embla__slide"
        :style="{
          '--max-width': `${props.maxWidth}px`,

        }"
      >
        <slot
          name="slide"
          :item="item"
        />
      </div>
    </div>
    <div class="embla__controls">
      <div class="embla__buttons">
        <UiButton
          v-if="!prevBtnDisabled"
          class="embla__button-prev"
          variant="rounded"
          @click="onPrevButtonClick"
        >
          <ArrowRightIcon />
        </UiButton>
        <UiButton
          v-if="!nextBtnDisabled"
          class="embla__button-next"
          variant="rounded"
          @click="onNextButtonClick"
        >
          <ArrowRightIcon />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "~/styles/newVariables";
@import "~/styles/mixins";

.embla {
  position: relative;
  max-width: var(--s-container);
  --slide-height: auto;
  --slide-spacing: 6px;
  --slide-size: 100%;
}

.embla__viewport {
  overflow: hidden;
}

.embla__container {
  backface-visibility: hidden;
  display: flex;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
}

.embla__slide {
  flex: 0 0 var(--slide-size);
  //max-width: var(--max-width);
  max-width: var(--max-width);
  aspect-ratio: var(--slide-ar);
  min-width: 0;
  padding-left: var(--slide-spacing);
}

.embla__controls {

}

.embla__buttons {
  position: absolute;
  width: 100%;
  top: 50%;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;

  button {
    pointer-events: auto;
  }

  .embla__button-prev {
    transform: rotate(180deg)
  }

  .embla__button-next {
    margin-left: auto;
  }

  @include mobileDevice() {
    display: none;
  }
}

.embla__button {
}

.embla__button:disabled {
  color: var(--detail-high-contrast);
}
</style>
