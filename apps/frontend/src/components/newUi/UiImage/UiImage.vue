<script lang="ts" setup>
import { ref } from 'vue';
import { NuxtImg } from '#components';
import { imgProps } from '#image/components/nuxt-img';

const props = defineProps({
  ...imgProps,
  fallbackSrc: {
    type: String,
    required: false,
    default: undefined,
  },
});
const imageSrc = ref(props.src ?? props.fallbackSrc ?? '/defaultPoster.svg');

const handleImageLoadingError = () => {
  imageSrc.value = props.fallbackSrc ?? '/defaultPoster.svg';
};
</script>

<template>
  <NuxtImg
    :src="imageSrc"
    loading="lazy"
    decoding="async"
    @error="handleImageLoadingError"
  />
</template>

