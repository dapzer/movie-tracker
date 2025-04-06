<script setup lang="ts">
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
import { UiTypography } from "~/shared/ui/UiTypography"
import { UiUserProfileLinkSkeleton } from "~/shared/ui/UiUserProfileLink"
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.info">
      <div :class="$style.about">
        <UiTypography variant="title2">
          <UiSkeleton
            :height="44"
            :width="200"
          />
        </UiTypography>
        <UiUserProfileLinkSkeleton />
      </div>

      <div :class="$style.actions">
        <UiSkeleton
          :width="100"
          :height="36"
        />
        <UiSkeleton
          :width="100"
          :height="36"
        />
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/variables";
@import "~/shared/styles/mixins";

.wrapper {
  .info > div {
    width: 100%;
  }

  .about {
    display: flex;
    flex-direction: column;
    gap: 16px;
  }

  .info {
    display: flex;
    justify-content: space-between;
    align-items: start;
    gap: 16px;

    @include mobileDevice {
      flex-wrap: wrap;
    }

    .actions {
      display: flex;
      gap: 8px;
      justify-content: flex-end;

      @include mobileDevice {
        &,
        span {
          width: 100%;
          max-width: 100%;
        }
      }
    }
  }
}
</style>
