<script setup lang="ts">
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.header">
      <div :class="$style.user">
        <UiSkeleton
          is-circle
          is-fixed-width
          :width="32"
          :height="32"
        />
        <UiSkeleton
          is-fixed-width
          :width="120"
          :height="16"
        />
      </div>
      <UiSkeleton
        is-fixed-width
        :width="70"
        :height="14"
      />
    </div>

    <div :class="$style.content">
      <UiSkeleton
        :width="180"
        :height="18"
      />
      <UiSkeleton :height="14" />
      <UiSkeleton :height="14" />
      <UiSkeleton
        :width="65"
        :height="14"
      />
      <UiSkeleton
        :width="40"
        :height="14"
      />
    </div>

    <UiSkeleton
      :width="180"
      :height="16"
    />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
  padding: 20px;
  background-color: var(--c-review-card-background);
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.user {
  display: flex;
  align-items: center;
  gap: 12px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
