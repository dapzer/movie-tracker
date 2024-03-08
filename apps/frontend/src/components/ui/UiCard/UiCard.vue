<script lang="ts" setup>
import { ref } from "vue";
import UiCardBase from "~/components/ui/UiCard/UiCardBase.vue";

interface UiCardProps {
  image?: string
  title?: string
  description?: string
  width?: number
  link?: string
  isHorizontal?: boolean
  isSmall?: boolean
}

const props = defineProps<UiCardProps>()
const imageSrc = ref(props.image)

const handleImageLoadingError = () => {
  imageSrc.value = '/defaultPoster.svg'
}
</script>

<template>
  <UiCardBase
    :width="props.width"
    :link="props.link"
    :isHorizontal="props.isHorizontal"
    :isSmall="props.isSmall"
  >
    <template #image>
      <NuxtImg
        :src="imageSrc"
        :alt="props.title"
        width="260"
        height="390"
        loading="lazy"
        decoding="async"
        @error="handleImageLoadingError"
      />
    </template>
    <template #description>
      {{ props.description }}
    </template>
    <template #title>
      {{ props.title }}
    </template>
    <slot />
  </UiCardBase>
</template>

<style lang="scss" module>
</style>
