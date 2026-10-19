<script setup lang="ts">
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.section">
      <UiSkeleton
        :width="110"
        :height="18"
        is-inline
      />
      <UiSkeleton :height="36" />
    </div>
    <UiDivider />
    <div :class="$style.section">
      <UiSkeleton
        :width="80"
        :height="18"
        is-inline
      />
      <UiSkeleton
        v-for="i in 3"
        :key="i"
        :height="36"
      />
    </div>
    <UiDivider />
    <div :class="$style.section">
      <UiSkeleton
        :width="130"
        :height="18"
        is-inline
      />
      <div :class="$style.sitesToView">
        <UiSkeleton :height="36" />
        <UiSkeleton :height="36" />
      </div>
    </div>
    <UiDivider />
    <div :class="$style.section">
      <UiSkeleton
        :width="60"
        :height="18"
        is-inline
      />
      <div :class="$style.note">
        <UiSkeleton :height="92" />
        <div :class="$style.noteFooter">
          <UiSkeleton
            :width="110"
            :height="16"
            is-inline
          />
          <div :class="$style.noteActions">
            <UiSkeleton
              :width="42"
              :height="24"
              is-inline
            />
            <UiSkeleton
              :width="42"
              :height="24"
              is-inline
            />
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;
  width: 100%;
}

.section {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.sitesToView {
  display: flex;
  flex-direction: column;
  gap: 6px;
}

.note {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.noteFooter {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 10px;
}

.noteActions {
  display: flex;
  gap: 4px;
}
</style>
