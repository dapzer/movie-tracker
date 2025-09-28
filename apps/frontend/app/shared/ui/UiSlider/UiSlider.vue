<script generic="T" setup lang="ts">
import { watchEffect } from "#imports"
import emblaCarouselVue from "embla-carousel-vue"
import { computed, ref } from "vue"
import { UiButton } from "~/shared/ui/UiButton"
import { UiIcon } from "~/shared/ui/UiIcon"

type UiSliderShadowSize = "medium"

interface UiSliderProps<T> {
  data: T[]
  maxWidth?: number | string
  spaceing?: number
  withShadow?: boolean
  buttonsTopOffset?: number
  hideButtons?: boolean
  shadowSize?: UiSliderShadowSize
}

const props = defineProps<UiSliderProps<T>>()

const [emblaRef, emblaApi] = emblaCarouselVue({
  align: "start",
})
const prevBtnDisabled = ref(true)
const nextBtnDisabled = ref(false)

function onSlideChange() {
  if (!emblaApi.value)
    return

  nextBtnDisabled.value = !emblaApi.value.canScrollNext()
  prevBtnDisabled.value = !emblaApi.value.canScrollPrev()
}

watchEffect(() => {
  if (!emblaApi.value)
    return

  onSlideChange()
  emblaApi.value?.on("reInit", onSlideChange).on("select", onSlideChange)
})

function onPrevButtonClick() {
  if (!emblaApi)
    return
  emblaApi?.value?.scrollPrev()
}

function onNextButtonClick() {
  if (!emblaApi)
    return
  emblaApi?.value?.scrollNext()
}

const maxWidthStyle = computed(() => {
  if (!props.maxWidth) {
    return "100%"
  }

  if (typeof props.maxWidth === "number") {
    return `${props.maxWidth}px`
  }

  return props.maxWidth
})
</script>

<template>
  <div
    class="embla"
    :class="[{
      'embla__shadow-left': props.withShadow && !prevBtnDisabled,
      'embla__shadow-right': props.withShadow && !nextBtnDisabled,
      'embla__shadow-medium': props.shadowSize === 'medium',
    }]"
    :style="{
      '--slide-spacing': props.spaceing ? `${props.spaceing}px` : '6px',
    }"
  >
    <div
      ref="emblaRef"
      class="embla__viewport"
    >
      <div class="embla__container">
        <div
          v-for="(item, index) in props.data"
          :key="index"
          class="embla__slide"
          :style="{
            '--max-width': maxWidthStyle,
          }"
        >
          <slot
            name="slide"
            :item="item"
          />
        </div>
      </div>
    </div>

    <div class="embla__controls">
      <div
        class="embla__buttons"
        :style="{
          '--top-offset': props.buttonsTopOffset && props.buttonsTopOffset >= 0 ? `${props.buttonsTopOffset}px` : '50%',
        }"
      >
        <UiButton
          v-if="!prevBtnDisabled && !props.hideButtons"
          class="embla__button-prev"
          variant="rounded"
          @click="onPrevButtonClick"
        >
          <UiIcon
            name="icon:arrow-right"
            :width="10"
          />
        </UiButton>
        <UiButton
          v-if="!nextBtnDisabled && !props.hideButtons"
          class="embla__button-next"
          variant="rounded"
          @click="onNextButtonClick"
        >
          <UiIcon
            name="icon:arrow-right"
            :width="10"
          />
        </UiButton>
      </div>
    </div>
  </div>
</template>

<style lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.embla {
  position: relative;
  max-width: var(--s-container);
  width: 100%;
  overflow: hidden;
  --slide-height: auto;
  --slide-spacing: 6px;
  --slide-size: 100%;

  &:before,
  &:after {
    content: "";
    z-index: 1;
    display: none;
    position: absolute;
    width: 197px;
    height: 100%;
    left: -100px;
    top: 0;
    pointer-events: none;
    background: linear-gradient(90deg, #0d0d0d 55.14%, rgba(13, 13, 13, 0) 100%);
  }

  &.embla__shadow-medium {
    &:before,
    &:after {
      width: 157px;
    }
  }

  &,
  &.embla__shadow-medium {
    &:before,
    &:after {
      @include mobileDevice() {
        width: 50px;
        left: -25px;
      }
    }
  }

  &:after {
    right: -100px;
    left: auto;
    background: linear-gradient(270deg, #0d0d0d 55.14%, rgba(13, 13, 13, 0) 100%);
  }

  @include mobileDevice() {
    &:after {
      right: -25px;
    }
  }

  &.embla__shadow-left {
    &:before {
      display: block;
    }
  }

  &.embla__shadow-right {
    &:after {
      display: block;
    }
  }
}

.embla__viewport {
  overflow: hidden;
}

.embla__container {
  display: flex;
  touch-action: pan-y pinch-zoom;
  margin-left: calc(var(--slide-spacing) * -1);
}

.embla__slide {
  transform: translate3d(0, 0, 0);
  flex: 0 0 var(--slide-size);
  max-width: var(--max-width);
  min-width: 0;
  margin-left: var(--slide-spacing);
}

.embla__buttons {
  position: absolute;
  width: 100%;
  z-index: 2;
  transform: translateY(-50%);
  display: flex;
  justify-content: space-between;
  align-items: center;
  pointer-events: none;

  top: var(--top-offset);

  button {
    pointer-events: auto;
  }

  .embla__button-prev {
    transform: rotate(180deg);
  }

  .embla__button-next {
    margin-left: auto;
  }

  @include mobileDevice() {
    display: none;
  }
}

.embla__button:disabled {
  color: var(--detail-high-contrast);
}
</style>
