<script setup lang="ts">
import { UiListCard } from "~/shared/ui/UiCard/listCard"
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
</script>

<template>
  <UiListCard
    :width="560"
  >
    <div :class="$style.header">
      <UiSkeleton :width="110" />
    </div>

    <div :class="$style.content">
      <div>
        <UiSkeleton :width="70" />
        <UiSkeleton :width="90" />
      </div>
      <UiSkeleton :width="30" />
    </div>
  </UiListCard>
</template>

<style module lang="scss">
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;

  & > div {
    display: flex;
    gap: 8px;
    align-items: center;
    row-gap: 4px;
    width: 100%;
  }
}
</style>
