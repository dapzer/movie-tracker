<script lang="ts" setup>

import { UiModal } from "~/components/ui/UiModal";
import { UiVideoCard } from "~/components/ui/UiCard";

interface VideoCardWithPlayerProps {
  videoUrl: string;
  description: string;
  previewUrl: string;
  title: string;
}

const props = defineProps<VideoCardWithPlayerProps>();
</script>

<template>
  <UiModal
    :title="props.title"
    :class="$style.trigger"
    button-variant="clear"
    is-full-width
  >
    <template #trigger>
      <UiVideoCard
        :description="props.description"
        :preview="props.previewUrl"
        :title="props.title"
      />
    </template>

    <template #content>
      <div :class="$style.frame">
        <iframe
          :src="props.videoUrl"
          :title="props.title"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          allowFullScreen
          frameBorder="0"
        />
      </div>
    </template>
  </UiModal>
</template>

<style lang="scss" module>
.trigger {
  text-align: start;
  width: 100%;
  max-width: 300px;
  user-select: text;
  cursor: pointer;
}

.frame {
  width: 100%;
  height: 100%;

  iframe {
    width: 100%;
    height: 100vw;
    max-height: 75vh;
  }
}
</style>
