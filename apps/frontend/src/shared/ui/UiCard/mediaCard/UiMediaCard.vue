<script lang="ts" setup>
import { NuxtLink } from "#components"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"
import UiCardBase from "../UiCardBase.vue"

interface UiMediaCardProps {
  imageSrc?: string
  title?: string
  description?: string
  width?: number
  linkUrl: string
  fallbackImageSrc?: string
  fullHeight?: boolean
}

const props = withDefaults(defineProps<UiMediaCardProps>(), {
  width: 195,
})
</script>

<template>
  <UiCardBase
    :full-height="props.fullHeight"
    :link-url="props.linkUrl"
    :width="props.width"
  >
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
      <div :class="$style.content">
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
          :as="NuxtLink"
          :to="props.linkUrl"
        >
          {{ props.title }}
        </UiTypography>

        <slot name="content" />

        <div :class="$style.footer">
          <UiTypography
            :class="$style.description"
            variant="description"
            data-allow-mismatch
          >
            {{ props.description }}
          </UiTypography>

          <slot name="control" />
        </div>
      </div>
    </template>
  </UiCardBase>
</template>

<style lang="scss" module>
@import "~/styles/mixins";
@import "~/styles/variables";

.image {
  aspect-ratio: 2/3;
  object-fit: cover;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title {
    @include ellipsisText();
    @include multiLineEllipsis(2);
    width: fit-content;
  }

  .footer {
    display: flex;
    justify-content: space-between;
    gap: 4px;

    .description {
      @include ellipsisText();
    }
  }
}
</style>
