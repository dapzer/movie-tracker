<script lang="ts" setup>
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"
import UiCardBase from "../UiCardBase.vue"

interface UiVideoCardProps {
  width?: number
  previewSrc: string
  description: string
  title: string
  fullHeight?: boolean
}

const props = withDefaults(defineProps<UiVideoCardProps>(), {
  width: 295,
})
</script>

<template>
  <UiCardBase
    :class="$style.wrapper"
    :width="props.width"
    :full-height="props.fullHeight"
  >
    <template #image>
      <div :class="$style.previewWrapper">
        <UiImage
          :src="props.previewSrc"
          height="157"
          width="279"
        />

        <div :class="$style.previewOverlay">
          <UiIcon
            name="icon:play"
            :size="26"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div :class="$style.content">
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
        >
          {{ props.title }}
        </UiTypography>
        <UiTypography
          variant="description"
          data-allow-mismatch
        >
          {{ props.description }}
        </UiTypography>
      </div>
    </template>
  </UiCardBase>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.wrapper {
  cursor: pointer;

  .content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title {
      @include ellipsisText();
      @include multiLineEllipsis(2);
    }
  }

  .previewWrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;

    img {
      aspect-ratio: 16 / 9;
      object-fit: cover;
    }

    img,
    .previewOverlay {
      border-radius: var(--s-border-radius-small);
    }

    .previewOverlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: 0.8;
      background-color: var(--c-main-background);
      color: var(--c-text);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &:not(:hover) .previewOverlay {
    display: none;
  }
}
</style>
