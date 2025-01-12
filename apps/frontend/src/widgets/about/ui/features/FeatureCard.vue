<script setup lang="ts">
import { UiTypography } from "~/components/ui/UiTypography"

interface FeatureCardProps {
  title: string
  description: string
  icon: string
}

const props = defineProps<FeatureCardProps>()
</script>

<template>
  <div :class="$style.wrapper">
    <component :is="props.icon" />
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
  background: linear-gradient(180deg, rgba(39, 136, 255, 0.05) 0%, rgba(13, 13, 13, 0.05) 100%), #0D0D0D;

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
