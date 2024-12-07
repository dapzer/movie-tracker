<script setup lang="ts">
import { UiTypography } from "~/components/ui/UiTypography"
import { UiSkeleton } from "~/components/ui/UiSkeleton"
import { UiUserProfileLinkSkeleton } from "~/components/ui/UiUserProfileLink"
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
@import "~/styles/variables";
@import "~/styles/mixins";

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
