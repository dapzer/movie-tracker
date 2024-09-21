<script lang="ts" setup>
import { UiTypography } from "~/components/newUi/UiTypography";
import { UiImage } from "~/components/newUi/UiImage"
import { UiTrimmedText } from "~/components/newUi/UiTrimmedText"

interface UiInfoHeaderProps {
  title: string;
  description?: string;
  image?: string;
  fallbackImage: string;
  overview?: string;
}

const props = defineProps<UiInfoHeaderProps>();
</script>

<template>
  <section :class="$style.wrapper">
    <div
      :class="$style.backgroundCircle"
      :style="{
        '--background-color': `url(${props.image || props.fallbackImage})`
      }"
    />

    <div :class="$style.poster">
      <div :class="$style.imageWrapper">
        <UiImage
          preload
          :src="props.image"
          :fallback-src="props.fallbackImage"
          loading="eager"
          fetchpriority="high"
          :width="256"
          :alt="props.title"
        />
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

      <div :class="$style.posterFooter">
        <slot name="posterFooter" />
      </div>
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
    </div>
  </section>
</template>

<style lang="scss" module>
@import "~/styles/newVariables";
@import "~/styles/mixins";

.wrapper {
  display: flex;
  gap: 32px;
  padding: 20px;
  background-color: var(--c-main-background-20);
  position: relative;
  overflow: visible;

  .backgroundCircle {
    position: absolute;
    top: -232px;
    left: -120px;
    width: 100%;
    max-width: 700px;
    height: 600px;
    opacity: .4;
    filter: blur(250px);
    background: var(--background-color);
    z-index: -1;
    transition: opacity .3s ease-in;
    animation: fadeInDefault .3s ease-in;

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
      opacity: .5;
      animation-name: fadeInTablet;
    }

    @include mobileDevice {
      margin: 0 auto;
      top: -87px;
      left: 0;
      right: 0;
      max-width: 342px;
      height: 257px;
      filter: blur(150px);
      opacity: .75;
      animation-name: fadeInMobile;
    }
  }


  .poster {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;
    max-width: 256px;

    .titleBlock {
      display: none;
    }

    .posterFooter {
      width: 100%;
      display: flex;
      align-items: center;
    }

    .imageWrapper,
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
    }
  }

  @include mobileDevice {
    flex-direction: column;
    padding: unset;
    background: unset;

    .titleBlock {
      display: none;
    }

    .poster {
      max-width: 100%;
      flex-direction: column;
      align-items: center;

      .imageWrapper {
        &, img {
          max-width: 124px;
        }
      }


      .titleBlock {
        display: flex;
        gap: 4px;
        align-items: center;
        text-align: center;
      }

      .posterFooter {
        margin-top: -8px;

        justify-content: center;
      }
    }
  }

  .content {
    width: 100%;
    display: flex;
    flex-direction: column;
    gap: 20px;

    .overview {
      white-space: pre-wrap !important;
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
          min-width: 0;
          white-space: pre-wrap;
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
