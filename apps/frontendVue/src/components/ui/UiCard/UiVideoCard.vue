<script setup lang="ts">

import UiCardBase from "~/components/ui/UiCard/UiCardBase.vue";
import { PlayIcon } from "~/components/ui/icons";
import { ref } from "vue";

interface UiVideoCardProps {
  preview?: string
  title?: string
  description?: string
}

const props = defineProps<UiVideoCardProps>()
const imageSrc = ref(props.preview)
const handleImageLoadingError = () => {
  imageSrc.value = '/defaultPoster.svg'
}
</script>

<template>
  <UiCardBase :class="$style.wrapper">
    <template #image>
      <div :class="$style.preview">
        <NuxtImg
          :src="imageSrc"
          :alt="props.title"
          width="260"
          height="147"
          @error="handleImageLoadingError"
        />
        <div :class="$style.overlay">
          <PlayIcon />
        </div>
      </div>
    </template>

    <template #description>
      {{ props.description }}
    </template>

    <template #title>
      {{ props.title }}
    </template>
  </UiCardBase>
</template>

<style module lang="scss">
.wrapper {
  .preview {
    position: relative;
    width: 100%;
    border-radius: var(--s-border-radius);
    height: 100%;
    min-height: 147px;
    display: flex;
    justify-content: center;
    align-items: center;

    .overlay {
      display: none;
      position: absolute;
      z-index: 1;
      top: 0;
      left: 0;
      border-radius: var(--s-border-radius);
      justify-content: center;
      align-items: center;
      width: 100%;
      height: 100%;
      background-color: rgba(0, 0, 0, 0.6);

      svg {
        width: 90px;
        height: 90px;
      }
    }
  }

  &:hover {
    .overlay {
      display: flex;
    }
  }
}
</style>
