<script setup lang="ts">

import { UiContainer } from "~/components/ui/UiContainer"
import { UiTypography } from "~/components/ui/UiTypography"
import { default as BackgroundGrid } from "~/public/landingBackgroundGrid.svg"
import { default as AddToListExample } from "~/public/landingAddToList.svg"
import { UiButton } from "~/components/ui/UiButton"
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { UiImage } from "~/components/ui/UiImage"

const localePath = useLocalePath()
</script>

<template>
  <div :class="$style.wrapper">
    <BackgroundGrid :class="$style.backgroundGrid" />
    <UiContainer
      as="section"
      :class="$style.container"
    >
      <div :class="$style.backgroundEllipse" />

      <div :class="$style.info">
        <UiTypography
          as="h1"
          variant="landingTitle"
        >
          {{ $t("about.hero.title") }}
        </UiTypography>
        <UiTypography
          :class="$style.description"
          variant="title4"
        >
          {{ $t("about.hero.description") }}
        </UiTypography>
        <div :class="$style.actions">
          <UiButton
            :as="NuxtLink"
            :to="localePath('/lists/community')"
            variant="outlined"
          >
            {{ $t("navigation.communityLists") }}
          </UiButton>
          <UiButton
            :as="NuxtLink"
            :to="localePath('/')"
          >
            {{ $t("about.hero.exploreLibrary") }}
          </UiButton>
        </div>
      </div>

      <div :class="$style.examples">
        <UiImage
          src="landingMainPage.png"
          :width="796"
          :height="453"
        />
        <AddToListExample
          :class="$style.addToListImage"
          width="291"
          height="241"
        />
        <UiImage
          :class="$style.listPageImage"
          src="landingListsPage.png"
          :width="183"
          :height="406"
        />
        <div :class="$style.exampleBottomBall" />
      </div>
    </UiContainer>
  </div>
</template>

<style module lang="scss">
@import "~/styles/variables";
@import "~/styles/mixins";

.wrapper {
  position: relative;

  .backgroundGrid {
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: calc(0px - var(--s-header-height));
    width: 1460px;
    height: 1036px;
    top: -75px;
    z-index: -1;

    //  TODO: Add adaptive
  }

  .container {
    position: relative;
    margin-top: 80px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    @include tabletDevice {
      margin-top: 110px;
    }

    @include mobileDevice {
      margin-top: 80px;
    }

    .backgroundEllipse {
      pointer-events: none;
      position: absolute;
      top: 145px;
      margin: 0 auto;
      border-radius: 100%;
      left: 0;
      right: 0;
      width: 100%;
      max-width: 897px;
      height: 167px;
      opacity: .6;
      background: linear-gradient(90deg, #1475E6 21.62%, #B747EC 100%);
      filter: blur(200px);

      @include tabletDevice() {
        top: 34px;
        max-width: 737px;
        height: 137px;
      }

      @include mobileDevice() {
        top: 27px;
        max-width: 318px;
        height: 102px;
        filter: blur(100px);
      }
    }

    .info {
      width: 100%;
      max-width: 696px;
      display: flex;
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 16px;
      text-align: center;

      .description {
        font-weight: var(--fw-regular);
      }

      .actions {
        display: flex;
        gap: 12px;
        margin-top: 14px;

        a {
          padding: 8px 12px;
        }

        @include mobileDevice {
          width: 100%;
          flex-direction: column;
          gap: 16px;
          margin-top: 64px;

          a {
            width: 100%;
          }
        }
      }
    }

    .examples {
      width: 100%;
      max-width: 796px;
      position: relative;
      display: flex;
      justify-content: center;
      margin-top: 96px;

      .listPageImage {
        position: absolute;
        bottom: -55px;
        right: -24px;
        width: 183px;
        height: 406px;
        box-shadow: -80px 4px 120px 0px rgba(39, 113, 255, 0.15);
      }

      .addToListImage {
        position: absolute;
        bottom: -35px;
        left: -34px;
      }

      .exampleBottomBall {
        position: absolute;
        width: 164px;
        filter: blur(200px);
        height: 164px;
        background: rgba(20, 117, 230, 1);
        bottom: -100px;
        left: -100px;
        z-index: -1;

        @include tabletDevice() {
          display: none;
        }
      }

      @include mobileDevice {
        display: none;
      }
    }
  }
}
</style>
