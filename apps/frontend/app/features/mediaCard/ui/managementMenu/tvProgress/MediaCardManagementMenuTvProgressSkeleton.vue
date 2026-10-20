<script setup lang="ts">
import { UiDivider } from "~/shared/ui/UiDivider"
import { UiSkeleton } from "~/shared/ui/UiSkeleton"

interface MediaCardManagementMenuTvProgressSkeletonProps {
  seasonCount?: number
}

const props = withDefaults(defineProps<MediaCardManagementMenuTvProgressSkeletonProps>(), {
  seasonCount: 3,
})
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.state">
      <div :class="$style.row">
        <UiSkeleton
          :width="150"
          :height="24"
          is-inline
        />
        <UiSkeleton
          :width="110"
          :height="16"
          is-inline
        />
      </div>
      <UiSkeleton :height="10" />
      <div :class="$style.row">
        <UiSkeleton
          :width="130"
          :height="18"
          is-inline
        />
        <UiSkeleton
          :width="90"
          :height="18"
          is-inline
        />
      </div>
    </div>
    <UiDivider />
    <div :class="$style.seasons">
      <div
        v-for="i in props.seasonCount"
        :key="i"
        :class="$style.seasonCard"
      >
        <div :class="$style.seasonInfo">
          <UiSkeleton
            :width="28"
            :height="28"
            is-circle
            is-fixed-width
          />
          <UiSkeleton
            :width="110"
            :height="18"
            is-fixed-width
          />
        </div>
        <div :class="$style.seasonMeta">
          <UiSkeleton
            :width="28"
            :height="18"
            is-fixed-width
          />
          <UiSkeleton
            is-circle
            :width="20"
            :height="20"
            is-fixed-width
          />
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
}

.state {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.row {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.seasons {
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.seasonCard {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 8px;
  padding: 12px;
  border-radius: var(--s-border-radius);
  border: 1px solid var(--c-stroke);
}

.seasonInfo {
  display: flex;
  align-items: center;
  gap: 16px;
}

.seasonMeta {
  display: flex;
  align-items: center;
  gap: 16px;
}
</style>
