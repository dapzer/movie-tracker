<script lang="ts" setup>

import { UiModal } from "~/components/ui/UiModal";
import { UiVideoCard } from "~/components/ui/UiCard";

interface VideoCardWithPlayerProps {
  videoUrl: string;
  description: string;
  previewSrc: string;
  title: string;
  width?: number;
  fullHeight?: boolean;
}

const props = defineProps<VideoCardWithPlayerProps>();
</script>

<template>
  <UiModal
    :title="props.title"
  >
    <template #trigger="{openModal}">
      <UiVideoCard
        :class="$style.trigger"
        :fullHeight="props.fullHeight"
        :title="props.title"
        :description="props.description"
        :preview-src="props.previewSrc"
        :width="props.width"
        @click="openModal"
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
@import "~/styles/variables";

.trigger {
  width: 100% !important;
  user-select: text;
  cursor: pointer;

  &.fullHeight {
    height: 100%;
  }
}

.frame {
  width: 100%;
  height: 100%;

  iframe {
    aspect-ratio: 16 / 9;
    width: 100%;
  }
}
</style>
