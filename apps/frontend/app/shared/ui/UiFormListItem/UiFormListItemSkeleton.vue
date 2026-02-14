<script setup lang="ts">
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiTypography } from "~/shared/ui/UiTypography"
</script>

<template>
  <div
    :class="$style.wrapper"
  >
    <div>
      <UiSkeleton
        :width="20"
        :height="20"
        is-circle
      />
      <UiTypography
        variant="label"
        :class="$style.title"
      >
        <UiSkeleton :width="100" />
      </UiTypography>
    </div>
    <div :class="$style.description">
      <UiSkeleton :width="35" />
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding: 10px 12px;
  gap: 16px;

  p {
    width: 100%;
  }

  div {
    display: flex;
    gap: 10px;
    align-items: center;
    width: 100%;
  }

  .description {
    justify-content: flex-end;
  }
}
</style>
