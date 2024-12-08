<script setup lang="ts">
import { useLocalStorage } from '@vueuse/core';
import { watchEffect } from '#imports';
import { ref } from 'vue';
import { UiImage } from '~/components/ui/UiImage';

interface UiAvatarProps {
  src?: string;
  placeholderId?: string;
  alt?: string;
  size?: number;
}

const props = withDefaults(defineProps<UiAvatarProps>(), {
  size: 24,
});
const placeholdersStorage = useLocalStorage<Record<string, string>>('avatarPlaceholders', {})
const placeholder = ref<string | undefined>(undefined);
const avatarSrc = ref<string | undefined>(props.src);

watchEffect(() => {
  avatarSrc.value = props.src;
});

const placeholderColors = [
  "linear-gradient(180deg, #73E5BC 0%, #23A628 100%)",
  "#665687",
  "linear-gradient(180deg, #E59C73 0%, #D15109 100%)",
  "linear-gradient(45deg, #737EE5 0%, #A62399 100%)",
  "linear-gradient(180deg, #242424 0%, #A62323 100%)"
]

const getPlaceholder = () => {
  const randomIndex = Math.floor(Math.random() * placeholderColors.length);
  return placeholderColors[randomIndex];
}

watchEffect(() => {
  if ((!props.src || !avatarSrc.value) && props.placeholderId) {
    const storedPlaceholder = placeholdersStorage.value[props.placeholderId];

    if (storedPlaceholder) {
      placeholder.value = storedPlaceholder;
    } else {
      const placeholderValue = getPlaceholder();
      placeholder.value = placeholderValue;
      placeholdersStorage.value[props.placeholderId] = placeholderValue;
    }
  } else {
    placeholder.value = getPlaceholder();
  }
});

const handleImageLoadingError = () => {
  avatarSrc.value = undefined;
};
</script>

<template>
  <div
    :class="$style.wrapper"
    :style="{
      '--size': `${props.size}px`
    }"
  >
    <UiImage
      v-if="avatarSrc"
      :src="avatarSrc"
      :width="props.size"
      :height="props.size"
      :alt="props.alt"
      @error="handleImageLoadingError"
    />

    <div
      v-else
      :class="$style.placeholder"
      :style="{ '--background': placeholder }"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  align-items: center;
  justify-content: center;

  &,
  img,
  .placeholder {
    width: var(--size);
    height: var(--size);
    aspect-ratio: 1 / 1;
    border-radius: 50%;
  }

  .placeholder {
    background: var(--background);
  }

  img {
    object-fit: cover;
  }
}
</style>
