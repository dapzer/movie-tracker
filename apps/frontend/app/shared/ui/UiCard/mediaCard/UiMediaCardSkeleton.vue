<script setup lang="ts">
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiTypography } from "~/shared/ui/UiTypography"
import UiCardBase from "../UiCardBase.vue"

interface UiMediaCardSkeletonProps {
  width?: number
  fullHeight?: boolean
}

const props = withDefaults(defineProps<UiMediaCardSkeletonProps>(), {
  width: 195,
})
</script>

<template>
  <UiCardBase
    :class="$style.wrapper"
    :full-height="props.fullHeight"
    :width="props.width"
  >
    <template #image>
      <UiSkeleton
        :class="$style.image"
        :width="179"
      />
    </template>

    <template #content>
      <div :class="$style.content">
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
        >
          <UiSkeleton />
        </UiTypography>

        <UiTypography
          :class="$style.description"
          variant="description"
        >
          <UiSkeleton
            is-fixed-width
            :width="112"
          />
        </UiTypography>
      </div>
    </template>
  </UiCardBase>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";

.wrapper {
  pointer-events: none;
}

.image {
  aspect-ratio: 2/3;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 4px;
}
</style>
