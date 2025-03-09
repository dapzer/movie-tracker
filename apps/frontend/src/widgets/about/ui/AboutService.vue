<script setup lang="ts">
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"
</script>

<template>
  <UiContainer
    :class="$style.wrapper"
    as="section"
  >
    <div :class="$style.body">
      <UiImage
        src="landingListsPagePc.webp"
        :class="$style.landingListsPagePcImage"
        width="540"
        height="334"
      />

      <div :class="$style.info">
        <UiTypography
          variant="title3"
          as="h1"
        >
          {{ $t("about.service.title") }}
        </UiTypography>
        <UiTypography>
          {{ $t("about.service.description") }}
        </UiTypography>
      </div>
    </div>
  </UiContainer>
</template>

<style module lang="scss">
@import "~/styles/mixins";
@import "~/styles/variables";

.wrapper {
  margin-top: 128px;

  .body {
    padding: 40px;
    display: grid;
    grid-template-columns: 1fr 1fr;
    gap: 40px;
    background:
      radial-gradient(64.63% 225.44% at 12.42% 12.5%, rgba(20, 117, 230, 0.2) 0%, rgba(13, 13, 13, 0.2) 100%), #0d0d0d;
    border-radius: var(--s-border-radius-super-huge);

    .landingListsPagePcImage {
      margin-top: -70px;
      aspect-ratio: 16/9;
      width: 100%;
      height: auto;
      max-width: 540px;
    }

    p {
      white-space: pre-wrap;
    }

    .info {
      width: 100%;
      max-width: 520px;
      display: flex;
      flex-direction: column;
      gap: 20px;
    }

    @include tabletDevice() {
      gap: 28px;
      padding: 30px 20px;

      .landingListsPagePcImage {
        margin-top: -60px;
        margin-left: -10px;
      }
    }

    @include mobilePlusDevice() {
      padding: 0;
      grid-template-columns: 1fr;
      background: none;
      border-radius: unset;

      .landingListsPagePcImage {
        display: none;
      }
    }
  }

  @include mobilePlusDevice() {
    margin-top: 70px;
  }
}
</style>
