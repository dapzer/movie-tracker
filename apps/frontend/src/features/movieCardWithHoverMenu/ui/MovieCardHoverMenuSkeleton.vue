<script setup lang="ts">

import { UiSkeleton } from "../../../shared/ui/UiSkeleton"
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <UiSkeleton :width="126" />
      <UiSkeleton :width="210" />
    </div>
    <UiSkeleton :width="189" />
    <UiSkeleton :width="189" />
    <div>
      <UiSkeleton />
      <UiSkeleton />
      <UiSkeleton />
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  max-width: 300px;

  .header {
    display: flex;
    flex-direction: column;
    gap: 4px;
  }
}
</style>
