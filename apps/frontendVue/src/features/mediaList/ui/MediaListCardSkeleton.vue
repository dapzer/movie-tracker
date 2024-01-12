<script lang="ts" setup>

import UiSkeleton from "~/components/ui/UiSkeleton.vue";
</script>

<template>
  <div :class="$style.wrapper">
    <UiSkeleton :height="150" />
    <div :class="$style.controls">
      <UiSkeleton
        v-for="i in 3"
        :key="i"
        :width="40"
        :height="36.6"
      />
    </div>
  </div>
</template>

<style lang="scss" module>
@import "~/styles/mixins";
@import "~/styles/variables";

.wrapper {
  @include card();
  max-width: 335px;

  .controls {
    display: flex;
    gap: 12px;

    & > *:last-child {
      margin-left: auto;
    }
  }

  @media screen and (max-width: $bp-md) {
    max-width: unset;
  }
}
</style>
