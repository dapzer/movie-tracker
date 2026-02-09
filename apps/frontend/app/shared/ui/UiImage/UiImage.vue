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
}

const props = defineProps<UiImageProps>()
const imageSrc = ref(props.src ?? props.fallbackSrc ?? "/defaultMoviePoster.svg")

function handleImageLoadingError() {
  imageSrc.value = props.fallbackSrc ?? "/defaultMoviePoster.svg"
}
</script>

<template>
  <NuxtImg
    :src="imageSrc"
    loading="lazy"
    decoding="async"
    @error="handleImageLoadingError"
  />
</template>
