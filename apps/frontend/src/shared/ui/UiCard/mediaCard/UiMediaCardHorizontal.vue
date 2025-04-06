<script lang="ts" setup>
import type { UiCardBaseProps } from "~/shared/ui/UiCard"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"
import UiCardBase from "../UiCardBase.vue"

export type UiMediaCardHorizontalSize = "small" | "medium"

export interface UiMediaCardHorizontalProps extends Omit<UiCardBaseProps, "horizontal"> {
  imageSrc?: string
  title?: string
  subDescription?: string
  size?: UiMediaCardHorizontalSize
  fallbackImageSrc?: string
}

const props = withDefaults(defineProps<UiMediaCardHorizontalProps>(), {
  imageWidth: 133,
  size: "medium",
})

const slots = defineSlots()
</script>

<template>
  <UiCardBase
    horizontal
    :full-height="props.fullHeight"
    :link-url="props.linkUrl"
    :width="props.width"
    :height="props.height"
    :image-width="props.imageWidth"
  >
    <template
      v-if="slots.precontent"
      #precontent
    >
      <slot name="precontent" />
    </template>

    <template #image>
      <UiImage
        :class="$style.image"
        :src="props.imageSrc"
        :fallback-src="props.fallbackImageSrc"
        height="277"
        width="179"
      />
    </template>

    <template #content>
      <div
        :class="[$style.content, {
          [$style.small]: props.size === 'small',
        }]"
      >
        <slot name="title" />

        <div :class="$style.description">
          <slot name="description" />

          <UiTypography
            :class="$style.description"
            variant="description"
            data-allow-mismatch
          >
            {{ props.subDescription }}
          </UiTypography>
        </div>
      </div>
    </template>
  </UiCardBase>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.image {
  aspect-ratio: 2/3;
  object-fit: cover;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 12px;

  @include mobileDevice() {
    gap: 8px;
  }

  .description {
    display: flex;
    flex-direction: column;
    gap: 6px;

    @include mobileDevice() {
      gap: 0;
    }
  }

  &.small {
    gap: 4px;

    .description {
      gap: 4px;
    }
  }
}
</style>
