<script setup lang="ts">
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"
</script>

<template>
  <div :class="$style.wrapper">
    <UiImage
      :class="$style.background"
      src="/communityListsHeroBackground.webp"
      loading="eager"
      preload
      fetchpriority="high"
    />

    <UiContainer :class="$style.content">
      <UiTypography
        variant="title2"
        as="h1"
      >
        {{ $t("communityLists.hero.title") }}
      </UiTypography>
      <UiTypography
        variant="text"
        as="h2"
        :class="$style.subtitle"
      >
        {{ $t("communityLists.hero.description") }}
      </UiTypography>
    </UiContainer>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  min-height: 228px;
  position: relative;
  display: flex;
  align-items: center;

  &:after {
    content: "";
    z-index: -1;
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    background:
      linear-gradient(270deg, rgba(25, 85, 237, 0) 48.37%, rgba(25, 85, 237, 0.2) 100%),
      linear-gradient(90deg, rgba(13, 13, 13, 0.25) 0%, rgba(13, 13, 13, 0) 45.3%);
  }
}

.background {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: -1;
  opacity: 0.2;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 16px;

  @include mobileDevice {
    align-items: center;

    * {
      text-align: center;
    }
  }
}

.subtitle {
  max-width: 516px;
  color: var(--c-text);
}
</style>
