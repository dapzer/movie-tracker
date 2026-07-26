<script setup lang="ts">
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.posterWrapper">
      <UiSkeleton
        :width="128"
        :height="200"
        :class="$style.poster"
      />

      <div :class="$style.posterOverlay">
        <UiSkeleton
          :class="$style.titleTextMobile"
          :width="160"
          :height="16"
        />
        <UiSkeleton
          is-fixed-width
          :width="52"
          :height="22"
        />
      </div>
    </div>

    <div :class="$style.body">
      <div :class="$style.header">
        <UiSkeleton
          :width="180"
          :height="16"
        />
        <UiSkeleton
          is-fixed-width
          :width="80"
          :height="14"
        />
      </div>

      <div :class="$style.content">
        <UiSkeleton
          :width="220"
          :height="18"
        />
        <UiSkeleton :height="14" />
        <UiSkeleton :height="14" />
        <UiSkeleton
          :width="70"
          :height="14"
        />
        <UiSkeleton
          :width="44"
          :height="14"
        />
      </div>

      <div :class="$style.footer">
        <div :class="$style.votes">
          <UiSkeleton
            is-fixed-width
            :width="36"
            :height="14"
          />
          <UiSkeleton
            is-fixed-width
            :width="36"
            :height="14"
          />
        </div>
        <div :class="$style.actions">
          <UiSkeleton
            is-circle
            is-fixed-width
            :width="24"
            :height="24"
          />
          <UiSkeleton
            is-circle
            is-fixed-width
            :width="24"
            :height="24"
          />
        </div>
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/variables";

.wrapper {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: var(--c-review-card-background);
}

.posterWrapper {
  width: 100%;
  max-width: 129px;
}

.poster {
  width: 100%;
  aspect-ratio: 2/3;
}

.posterOverlay {
  display: none;
}

.body {
  width: 100%;
  min-width: 0;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.header {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 8px;
}

.footer {
  margin-top: auto;
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 8px;

  @include mobileDevice() {
    flex-wrap: wrap;
    justify-content: flex-start;
  }
}

.votes,
.actions {
  display: flex;
  align-items: center;
  gap: 16px;
}

.titleTextMobile {
  display: none;
}

@include mobileDevice() {
  .wrapper {
    flex-direction: column;
  }

  .posterWrapper {
    max-width: unset;
    display: flex;
    gap: 16px;
  }

  .poster {
    flex-shrink: 0;
    width: 50px;
    height: 74px;
  }

  .posterOverlay {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 6px;
  }

  .header > :first-child {
    display: none;
  }

  .titleTextMobile {
    display: block;
  }
}
</style>
