<script lang="ts" setup>
import { NuxtImg } from "#components"
import { imgProps } from "#image/components/NuxtImg.vue"
import { ref } from "vue"

const props = defineProps({
  ...imgProps,
  fallbackSrc: {
    type: String,
    required: false,
    default: undefined,
  },
})
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
