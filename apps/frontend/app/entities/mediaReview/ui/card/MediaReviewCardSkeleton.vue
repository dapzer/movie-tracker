<script setup lang="ts">
import { UiSkeleton } from "~/shared/ui/UiSkeleton"
</script>

<template>
  <div :class="$style.wrapper">
    <div :class="$style.avatarPc">
      <UiSkeleton
        is-circle
        is-fixed-width
        :width="44"
        :height="44"
      />
    </div>
    <div :class="$style.body">
      <div :class="$style.header">
        <div :class="$style.user">
          <UiSkeleton
            :class="$style.avatarMobile"
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
          :width="80"
          :height="14"
        />
      </div>
      <div :class="$style.content">
        <UiSkeleton
          :width="200"
          :height="16"
        />
        <UiSkeleton :height="14" />
        <UiSkeleton :height="14" />
        <UiSkeleton
          :width="70"
          :height="14"
        />
      </div>
      <div :class="$style.footer">
        <UiSkeleton
          :width="40"
          :height="14"
        />
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
      </div>
    </div>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  gap: 16px;
  padding: 20px;
  background-color: var(--c-review-card-background);
}

.avatarMobile {
  display: none;
}

@include mobileDevice() {
  .avatarPc {
    display: none;
  }

  .avatarMobile {
    display: flex;
  }
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

.body {
  width: 100%;
  display: flex;
  flex-direction: column;
  gap: 16px;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 10px;
}

.footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 24px;
}

.votes {
  display: flex;
  gap: 16px;
}
</style>
