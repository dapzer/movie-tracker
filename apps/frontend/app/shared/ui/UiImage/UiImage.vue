<script lang="ts" setup>
import { NuxtImg } from "#components"
import { ref } from "vue"

interface UiImageProps {
  fallbackSrc?: string
  src?: string
  width?: string | number
  height?: string | number
  sizes?: string
  format?: string
  quality?: number | string
  provider?: string
  placeholder?: boolean | string | number
  modifiers?: Record<string, any>
  loading?: "lazy" | "eager"
  fetchpriority?: "high" | "low" | "auto"
}

const props = withDefaults(defineProps<UiImageProps>(), {
  loading: "lazy",
})
const imageSrc = ref(props.src ?? props.fallbackSrc ?? "/defaultMoviePoster.svg")

function handleImageLoadingError() {
  imageSrc.value = props.fallbackSrc ?? "/defaultMoviePoster.svg"
}
</script>

<template>
  <NuxtImg
    :class="$style.body"
    :src="imageSrc"
    :width="props.width"
    :height="props.height"
    :sizes="props.sizes"
    :format="props.format"
    :quality="props.quality"
    :placeholder="props.placeholder"
    :modifiers="props.modifiers"
    :loading="props.loading"
    :fetchpriority="props.fetchpriority"
    decoding="async"
    @error="handleImageLoadingError"
  />
</template>

<style module lang="css">
.body {
  color: transparent;
}
</style>
