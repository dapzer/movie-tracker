<script setup lang="ts">

import UiSkeleton from "~/components/ui/UiSkeleton.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography>
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
.wrapper {
  display: flex;
  align-items: center;
  gap: 10px;
}
</style>
