<script lang="ts" setup>
import { ref } from "vue"

interface UiImageProps {
  fallbackSrc?: string
  src?: string
  width?: string | number
  height?: string | number
  loading?: "lazy" | "eager"
  fetchpriority?: "high" | "low" | "auto"
  alt: string
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
  <img
    :class="$style.body"
    :src="imageSrc"
    :width="props.width"
    :height="props.height"
    :loading="props.loading"
    :fetchpriority="props.fetchpriority"
    decoding="async"
    :alt="props.alt"
    @error="handleImageLoadingError"
  >
</template>

<style module lang="css">
.body {
  color: transparent;
}
</style>
