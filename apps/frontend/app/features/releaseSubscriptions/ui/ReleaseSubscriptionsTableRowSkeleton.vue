<script setup lang="ts">
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiTableCell, UiTableRow } from "~/shared/ui/UiTable"
</script>

<template>
  <UiTableRow>
    <UiTableCell>
      <div :class="$style.info">
        <UiSkeleton
          :width="42"
          :height="64"
          is-fixed-width
        />
        <UiSkeleton
          :width="160"
          is-fixed-width
        />
      </div>
    </UiTableCell>
    <UiTableCell>
      <div :class="$style.episode">
        <UiSkeleton
          :width="80"
          :height="44"
          is-fixed-width
        />
        <div :class="$style.episodeText">
          <UiSkeleton
            :width="220"
            :height="20"
            is-fixed-width
          />
          <UiSkeleton
            :width="120"
            :height="18"
            is-fixed-width
          />
        </div>
      </div>
    </UiTableCell>
    <UiTableCell align="right">
      <UiSkeleton
        :width="120"
        :height="36"
        is-fixed-width
      />
    </UiTableCell>
  </UiTableRow>
</template>

<style module lang="scss">
.info {
  display: flex;
  align-items: center;
  gap: 16px;
}

.episode {
  display: flex;
  align-items: center;
  gap: 16px;
}

.episodeText {
  display: flex;
  flex-direction: column;
  gap: 8px;
}
</style>
