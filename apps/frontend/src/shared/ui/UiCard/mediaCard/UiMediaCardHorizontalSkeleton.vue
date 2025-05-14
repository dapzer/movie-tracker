<script lang="ts" setup>
import type { UiCardBaseProps } from "~/shared/ui/UiCard"
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiTypography } from "~/shared/ui/UiTypography"
import UiCardBase from "../UiCardBase.vue"

export type UiMediaCardHorizontalSize = "small" | "medium"

export interface UiMediaCardHorizontalProps extends Omit<UiCardBaseProps, "horizontal" | "linkUrl"> {
  size?: UiMediaCardHorizontalSize
  imageWidth?: number
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
      <UiSkeleton
        :class="$style.image"
        :width="props.imageWidth"
      />
    </template>

    <template #content>
      <div
        :class="[$style.content, {
          [$style.small]: props.size === 'small',
        }]"
      >
        <UiTypography variant="cardTitle">
          <UiSkeleton
            :width="225"
          />
        </UiTypography>

        <div :class="$style.description">
          <UiTypography
            :class="$style.description"
            variant="description"
          >
            <UiSkeleton
              :width="150"
            />
          </UiTypography>
          <UiTypography
            :class="$style.description"
            variant="description"
          >
            <UiSkeleton
              :width="75"
            />
          </UiTypography>
        </div>
      </div>
    </template>
  </UiCardBase>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";

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
