<script lang="ts" setup>
import type { UserType } from "@movie-tracker/types"
import { computed } from "vue"
import { UiCardBase } from "~/shared/ui/UiCard"
import { UiImage } from "~/shared/ui/UiImage"

interface UiListCardProps {
  width?: number | string
  linkUrl?: string
  user?: Pick<UserType, "image" | "name" | "id">
  userPageUrl?: string
  imagesSrc?: Array<string | undefined>
  horizontal?: boolean
}

const props = withDefaults(defineProps<UiListCardProps>(), {
  width: 396,
  imagesSrc: () => [],
})
const slots = defineSlots()

const imagesCount = computed(() => {
  return props.horizontal ? 10 : 6
})
</script>

<template>
  <UiCardBase
    :horizontal="props.horizontal"
    :class="[$style.wrapper, {
      [$style.wrapperHorizontal]: props.horizontal,
    }]"
    :width="props.horizontal ? 'unset' : 560"
    :link-url="props.linkUrl"
  >
    <template #image>
      <div
        :class="$style.images"
        :style="{ '--images-count': 10 }"
      >
        <div
          v-for="number in imagesCount"
          :key="props.imagesSrc?.[number - 1] ?? number"
          :style="{
            '--z-index': imagesCount - number,
          }"
          :class="$style.imagesItem"
        >
          <UiImage
            v-if="number <= props.imagesSrc?.length"
            :src="props.imagesSrc?.[number - 1] || '/defaultMoviePoster.svg'"
            fallback-src="/defaultMoviePoster.svg"
          />
        </div>
      </div>
    </template>

    <template #content>
      <div :class="$style.contentWrapper">
        <div
          v-if="slots.header"
          :class="$style.header"
        >
          <slot name="header" />
        </div>

        <div :class="$style.content">
          <slot name="content" />
        </div>

        <slot name="footer" />
      </div>
    </template>
  </UiCardBase>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";

.wrapper {
  padding: 16px;
  gap: 0;

  @include mobileDevice {
    padding: 10px;
  }

  .header {
    margin-top: 10px;
    display: flex;
    align-items: center;
    justify-content: space-between;

    @include mobileDevice {
      margin-top: 8px;
    }
  }

  .images {
    width: 100%;
    display: flex;
    overflow: hidden;
    border-radius: var(--s-border-radius);

    .imagesItem {
      display: flex;
      background: linear-gradient(337.92deg, #151515 3.25%, #1e1e1e 52.25%, #151515 100%);
      box-shadow: 4px 0px 20px rgba(13, 13, 13, 0.56);
      z-index: var(--z-index);

      &:not(:first-child) {
        margin-left: -35px;
      }

      &,
      img {
        height: 100%;
        aspect-ratio: 2/ 3;
        width: 100%;
      }
    }
  }

  .contentWrapper {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .content {
      display: flex;
      flex-direction: column;
      gap: 4px;
      margin-top: 16px;

      @include mobileDevice {
        margin-top: 12px;
      }
    }
  }
}

.wrapperHorizontal {
  @include untilMobileDevice() {
    gap: 24px;
    padding: 8px;
    max-height: 148px;

    .contentWrapper {
      height: 100%;
      justify-content: space-between;
    }

    .contentWrapper > .content,
    .header {
      margin-top: 0;
    }

    .imagesItem {
      img,
      & {
        max-width: 90px;
        max-height: 133px;
      }
    }
  }

  @include mobileDevice() {
    flex-direction: column;
    .imagesItem:nth-child(n + 6) {
      display: none;
    }
  }
}
</style>
