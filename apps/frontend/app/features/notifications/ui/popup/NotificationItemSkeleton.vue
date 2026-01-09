<script setup lang="ts">
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.leftSection">
      <span :class="$style.readStatus" />
      <UiSkeleton
        is-circle
        is-fixed-width
        :width="36"
        :height="36"
      />
    </div>
    <div :class="$style.content">
      <UiSkeleton
        :width="224"
        :class="$style.title"
        :height="18"
      />
      <UiSkeleton
        :width="82"
        :height="18"
      />
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  padding: 12px 20px 12px 4px;
  display: flex;
  gap: 12px;
  width: 100%;
}

.title {
  margin-bottom: 2px;
}

.leftSection {
  display: flex;
  align-items: center;
  gap: 4px;
  height: fit-content;
}

.readStatus {
  width: 4px;
  height: 4px;
  border-radius: 50%;
  background-color: transparent;
  margin: 4px;
  align-self: center;
}

.content {
  width: 100%;
}
</style>
