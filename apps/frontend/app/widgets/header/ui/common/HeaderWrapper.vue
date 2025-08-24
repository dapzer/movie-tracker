<script setup lang="ts">
import { UiContainer } from "~/shared/ui/UiContainer"
</script>

<template>
  <header :class="$style.wrapper">
    <UiContainer :class="$style.content">
      <slot />
    </UiContainer>
  </header>
</template>

<style lang="scss" module>
.wrapper {
  width: 100%;
  padding-right: var(--scrollbar-width);
  background: var(--c-header-footer-background);
  min-height: var(--s-header-height);
  border-bottom: 1px solid var(--c-stroke);
  z-index: var(--i-header);
  position: fixed;
  top: 0;
  left: 0;
  display: flex;
  align-items: center;
}

.content {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 16px;
}
</style>
