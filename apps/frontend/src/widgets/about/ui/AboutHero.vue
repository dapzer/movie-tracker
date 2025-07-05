<script setup lang="ts">
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { UiButton } from "~/shared/ui/UiButton"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"

const localePath = useLocalePath()
</script>

<template>
  <div :class="$style.wrapper">
    <span :class="$style.backgroundGrid" />
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
          :class="$style.mainPageImage"
          src="landingMainPage.webp"
          :width="796"
          :height="453"
        />
        <UiIcon
          name="svg:landing-add-to-list"
          :class="$style.addToListImage"
          :width="291"
          :height="241"
        />
        <UiImage
          :class="$style.listPageImage"
          src="landingListsPage.webp"
          :width="183"
          :height="406"
        />
        <div :class="$style.exampleBottomBall" />
      </div>
    </UiContainer>
  </div>
</template>

<style module lang="scss">
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  position: relative;
  overflow-x: clip;

  .backgroundGrid {
    background: url("~/assets/svg/images/landing-background-grid.svg") center no-repeat;
    position: absolute;
    left: 50%;
    transform: translateX(-50%);
    margin-top: calc(0px - var(--s-header-height));
    width: 1460px;
    height: 1036px;
    top: -120px;
    z-index: -1;
    background-size: 100% 100%;

    @include tabletDevice() {
      width: 1057px;
      height: 750px;
      top: -12px;
    }

    @include mobilePlusDevice() {
      width: 428px;
      height: 303px;
      top: -30px;
    }
  }

  .container {
    position: relative;
    margin-top: 80px;
    display: flex;
    justify-content: center;
    flex-direction: column;
    align-items: center;

    @include tabletDevice {
      margin-top: 80px;
    }

    @include mobilePlusDevice {
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
      opacity: 0.6;
      background: linear-gradient(90deg, #1475e6 21.62%, #b747ec 100%);
      filter: blur(200px);
      z-index: -1;

      @include tabletDevice() {
        top: 34px;
        max-width: 737px;
        height: 137px;
      }

      @include mobilePlusDevice() {
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
        color: var(--c-white-70);
      }

      .actions {
        display: flex;
        gap: 12px;
        margin-top: 14px;

        a {
          padding: 8px 12px;
        }

        @include mobilePlusDevice {
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
      aspect-ratio: 16/9;

      .mainPageImage,
      .listPageImage,
      .addToListImage {
        user-select: none;
        pointer-events: none;
      }

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

      @include mobilePlusDevice {
        display: none;
      }
    }
  }
}
</style>
