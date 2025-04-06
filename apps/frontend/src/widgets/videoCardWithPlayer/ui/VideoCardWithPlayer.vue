<script lang="ts" setup>
import { NuxtLink } from "#components"
import { UiVideoCard } from "~/shared/ui/UiCard"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiModal } from "~/shared/ui/UiModal"
import { UiTypography } from "~/shared/ui/UiTypography"

interface VideoCardWithPlayerProps {
  videoUrl: string
  sourceUrl?: string
  description: string
  previewSrc: string
  title: string
  width?: number
  fullHeight?: boolean
}

const props = defineProps<VideoCardWithPlayerProps>()
</script>

<template>
  <UiModal
    :title="props.title"
  >
    <template #trigger="{ openModal }">
      <UiVideoCard
        :class="$style.trigger"
        :full-height="props.fullHeight"
        :title="props.title"
        :description="props.description"
        :preview-src="props.previewSrc"
        :width="props.width"
        @click="openModal"
      />
    </template>

    <template
      v-if="props.sourceUrl"
      #afterTitle
    >
      <UiTypography
        :class="$style.sourсeUrl"
        :as="NuxtLink"
        schema="link"
        :to="props.sourceUrl"
        target="_blank"
      >
        <UiIcon name="icon:round-open-in-new-tab" />
      </UiTypography>
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
@import "~/shared/styles/variables";

.trigger {
  width: 100% !important;
  user-select: text;
  cursor: pointer;

  &.fullHeight {
    height: 100%;
  }
}

.sourсeUrl {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 24px;
  font-size: 20px;
  height: 24px;
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
