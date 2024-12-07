<script lang="ts" setup>

import { UiTypography } from '~/components/ui/UiTypography';
import { UiSkeleton } from "~/components/ui/UiSkeleton"
</script>

<template>
  <div :class="$style.wrapper">
    <UiSkeleton
      is-circle
      :width="24"
      :height="24"
    />
    <UiTypography variant="label">
      <UiSkeleton :width="100" />
    </UiTypography>
  </div>
</template>

<style lang="scss" module>
@import '~/styles/mixins';

.wrapper {
  display: flex;
  align-items: center;
  gap: 8px;

  p {
    flex: 1;
  }
}
</style>
