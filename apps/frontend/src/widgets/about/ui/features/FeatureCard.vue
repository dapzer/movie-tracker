<script setup lang="ts">
import type { VNode } from "vue"
import { UiTypography } from "../~/shared/ui/UiTypography"

interface FeatureCardProps {
  title: string
  description: string
  icon: VNode
}

const props = defineProps<FeatureCardProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <component
      :is="props.icon"
      :class="$style.icon"
    />
    <div :class="$style.info">
      <UiTypography variant="title4">
        {{ props.title }}
      </UiTypography>
      <UiTypography>{{ props.description }}</UiTypography>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/styles/variables";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;
  padding: 20px;
  border-radius: var(--s-border-radius-huge);
  border: 1px solid var(--c-white-12);
  box-shadow: 0px 1px 0px 0px rgba(41, 137, 255, 0.15) inset;
  background: linear-gradient(180deg, rgba(39, 136, 255, 0.05) 0%, rgba(13, 13, 13, 0.05) 100%), #0d0d0d;

  .icon {
    font-size: 40px;
  }

  @include tabletDevice() {
    gap: 24px;
  }

  @include mobilePlusDevice() {
    padding: 16px;
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 10px;
  }
}
</style>
