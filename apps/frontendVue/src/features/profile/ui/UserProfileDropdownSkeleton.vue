<script setup lang="ts">

import UiSkeleton from "~/components/ui/UiSkeleton.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography :class="$style.userName">
      <UiSkeleton
        :width="64"
        isFixedWidth
      />
    </UiTypography>
    <UiSkeleton
      :width="32"
      :height="32"
      isFixedWidth
      isCircle
    />
  </div>
</template>

<style module lang="scss">
@import "~/styles/variables";

.wrapper {
  display: flex;
  align-items: center;
  gap: 10px;

  .userName {
    @media screen and (max-width: $bp-md) {
      display: none;
    }
  }
}
</style>
