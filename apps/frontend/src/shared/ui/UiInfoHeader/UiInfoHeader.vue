<script lang="ts" setup>
import { NuxtLink } from "#components"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTrimmedText } from "~/shared/ui/UiTrimmedText"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiInfoHeaderProps {
  title: string
  description?: string
  image?: string
  fallbackImage: string
  overview?: string
  backButtonText?: string
  backButtonUrl?: string
  posterSize?: "small"
}

const props = defineProps<UiInfoHeaderProps>()
const slots = defineSlots()
</script>

<template>
  <section :class="$style.wrapper">
    <UiTypography
      v-if="props.backButtonUrl && props.backButtonText"
      :class="$style.backButton"
      :as="NuxtLink"
      :to="props.backButtonUrl"
      variant="label"
    >
      <UiIcon
        name="icon:back-arrow-small"
        :class="$style.backArrowSmall"
      />
      <UiIcon
        name="icon:back-arrow-medium"
        :class="$style.backArrowMedium"
      />
      <span>
        {{ props.backButtonText }}
      </span>
    </UiTypography>

    <div :class="$style.body">
      <div
        :class="$style.backgroundCircle"
        :style="{
          '--background-color': `url(${props.image || props.fallbackImage})`,
        }"
      />

      <div
        :class="[$style.poster, {
          [$style.small]: props.posterSize === 'small',
        }]"
      >
        <div :class="$style.imageWrapper">
          <div
            :class="$style.backgroundCircle"
            :style="{
              '--background-color': `url(${props.image || props.fallbackImage})`,
            }"
          />
          <div
            :class="$style.imageBody"
          >
            <UiImage
              :src="props.image"
              :fallback-src="props.fallbackImage"
              loading="eager"
              preload
              fetchpriority="high"
              :width="256"
              :alt="props.title"
            />
          </div>
        </div>

        <div
          aria-hidden="true"
          :class="$style.titleBlock"
        >
          <UiTypography
            aria-hidden="true"
            as="p"
            variant="title2"
          >
            {{ props.title }}
          </UiTypography>
          <UiTypography
            aria-hidden="true"
            :class="$style.description"
            as="span"
            variant="subheading"
          >
            {{ props.description }}
          </UiTypography>
        </div>

        <template
          v-if="slots.posterFooter"
        >
          <slot name="posterFooter" />
        </template>
      </div>

      <div :class="$style.content">
        <div :class="$style.titleBlock">
          <UiTypography
            as="h1"
            variant="title2"
          >
            {{ props.title }}
          </UiTypography>
          <UiTypography
            :class="$style.description"
            as="span"
            variant="subheading"
          >
            {{ props.description }}
          </UiTypography>
        </div>

        <table :class="$style.table">
          <tbody>
            <slot name="tableItems" />
          </tbody>
        </table>

        <UiTrimmedText
          v-if="props.overview"
          :class="$style.overview"
          :text="props.overview.replace(/\r\s*/g, '\n\n')"
          :max-lines="6"
          :max-chars-in-line="99"
        />

        <template v-if="slots.content">
          <slot name="content" />
        </template>
      </div>
    </div>
  </section>
</template>

<style lang="scss" module>
@import "~/shared/styles/breakpoints";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;
  position: relative;

  .backButton {
    display: flex;
    align-items: center;
    color: var(--c-description);
    width: fit-content;

    .backArrowSmall {
      color: var(--c-text);
    }

    &:hover {
      &,
      .backArrowSmall {
        color: var(--c-label-lihk-hovered);
      }
    }

    span {
      font-family: inherit;
      line-height: inherit;
    }

    .backArrowMedium {
      display: none;
    }

    @include mobileDevice {
      position: absolute;
      width: 32px;
      height: 32px;
      border-radius: 100%;
      top: 12px;
      align-items: center;
      justify-content: center;
      background: var(--c-white-15);
      z-index: 1;

      .backArrowSmall {
        display: none;
      }

      .backArrowMedium {
        display: block;
      }

      span {
        display: none;
      }
    }
  }
}

.body {
  display: flex;
  gap: 32px;
  padding: 20px;
  background-color: var(--c-main-background-20);
  border-radius: var(--s-border-radius);
  position: relative;
  overflow: visible;

  .backgroundCircle {
    position: absolute;
    top: -232px;
    left: -120px;
    width: 100%;
    max-width: 700px;
    height: 600px;
    opacity: 0.4;
    filter: blur(250px);
    background: var(--background-color);
    z-index: -1;
    transition: opacity 0.3s ease-in;
    animation: fadeInDefault 0.3s ease-in;

    @keyframes fadeInDefault {
      from {
        opacity: 0;
      }
      to {
        opacity: 0.4;
      }
    }

    @keyframes fadeInTablet {
      from {
        opacity: 0;
      }
      to {
        opacity: 0.5;
      }
    }

    @keyframes fadeInMobile {
      from {
        opacity: 0;
      }
      to {
        opacity: 0.75;
      }
    }

    @include tabletDevice {
      top: -169px;
      left: -80px;
      max-width: 473px;
      height: 425px;
      opacity: 0.5;
      animation-name: fadeInTablet;
    }

    @include mobileDevice {
      display: none;
      margin: 0 auto;
      top: -35px;
      left: 0;
      right: 0;
      max-width: 360px;
      height: 236px;
      filter: blur(150px);
      opacity: 0.75;
      animation-name: fadeInMobile;
    }
  }

  .poster {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 256px;

    &.small {
      max-width: 180px;
    }

    .backgroundCircle,
    .titleBlock {
      display: none;
    }

    .imageBody {
      display: flex;
    }

    .imageBody,
    img {
      width: 100%;
      max-width: 256px;
      aspect-ratio: 2/3;
      border-radius: var(--s-border-radius-small);
    }
  }

  .titleBlock {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 8px;

    .description {
      color: var(--c-description);
    }
  }

  @include tabletDevice {
    .poster {
      max-width: 200px;

      &.small {
        max-width: 180px;
      }
    }
  }

  @include mobileDevice {
    flex-direction: column;
    padding: unset;
    background: unset;
    border-radius: unset;
    gap: 24px;

    .titleBlock {
      display: none;
    }

    .poster {
      max-width: 100%;
      flex-direction: column;
      align-items: center;

      &.small {
        max-width: 100%;
      }

      .imageWrapper {
        position: relative;
        width: 100%;
        height: 100%;
        display: flex;
        flex-direction: column;
        align-items: center;
        overflow-y: clip;
        overflow-x: visible;

        .backgroundCircle {
          display: flex;
        }

        .imageBody {
          &,
          img {
            max-width: 160px;
          }
        }
      }

      .titleBlock {
        display: flex;
        gap: 4px;
        margin-bottom: -8px;
      }
    }
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 32px;

    .overview {
      margin-top: 8px;
      white-space: pre-wrap !important;
    }

    @include mobileDevice {
      gap: 24px;

      .overview {
        margin-top: 0;
      }
    }
  }

  .table {
    width: 100%;
    border-collapse: collapse;

    tr:not(:last-child) {
      td {
        padding-bottom: 10px;
      }
    }

    tr {
      td:nth-child(1) {
        color: var(--c-text);
        font-size: var(--fs-label);
        line-height: var(--lh-p);
        font-weight: var(--fw-medium);
        font-family: var(--ff-inter);
        width: max-content;
        white-space: nowrap;
        padding-right: 16px;
        min-width: 120px;

        @include mobileDevice {
          min-width: 200px;
          white-space: unset;
          word-break: break-word;
        }
      }

      td:nth-child(2) {
        color: var(--c-description);
        font-size: var(--fs-p);
        line-height: var(--lh-p);
        font-weight: var(--fw-regular);
        width: 100%;

        a {
          color: var(--c-label-link);
          cursor: pointer;

          &:active,
          &:focus,
          &:hover {
            color: var(--c-label-lihk-hovered);
          }
        }
      }
    }
  }
}
</style>
