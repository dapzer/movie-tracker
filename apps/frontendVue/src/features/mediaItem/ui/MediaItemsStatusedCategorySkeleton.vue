<script setup lang="ts">
import UiDetails from "~/components/ui/UiDetails.vue";
import UiTypography from "~/components/ui/UiTypography.vue";
import UiSkeleton from "~/components/ui/UiSkeleton.vue";
import { UiCardSkeleton } from "~/components/ui/UiCard";
</script>

<template>
  <div :class="$style.wrapper">
    <UiSkeleton :height="48" />
    <div :class="$style.items">
      <UiCardSkeleton
        v-for="i in 8"
        :key="i"
      />
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/styles/variables";
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 16px;

  .items {
    display: grid;
    grid-template-columns: repeat(auto-fill, 300px);
    justify-content: space-between;
    flex-wrap: wrap;
    gap: 20px;

    @media screen and (max-width: $bp-md){
      grid-template-columns: repeat(auto-fill, 100%);
    }
  }
}
</style>
