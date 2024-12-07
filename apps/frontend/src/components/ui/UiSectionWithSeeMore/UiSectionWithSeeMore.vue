<script setup lang="ts">

import { UiTypography } from "~/components/ui/UiTypography"
import { ArrowRightBoldIcon } from "~/components/ui/icons"
import { NuxtLink } from "#components"

interface UiSectionWithSeeMoreProps {
  title: string;
  seeMoreText?: string;
  hideSeeMore?: boolean;
  seeMoreUrl?: string;
  seeMoreMobileOnly?: boolean;
  seeMoreAlign?: 'start' | 'end';
}

const props = withDefaults(defineProps<UiSectionWithSeeMoreProps>(), {
  seeMoreAlign: 'start'
})
const emits = defineEmits<{
  (e: 'onClickSeeMore'): void
}>()

</script>

<template>
  <section :class="$style.wrapper">
    <div
      :class="[$style.header, {
        [$style.alignEnd]: props.seeMoreAlign === 'end'
      }]"
    >
      <UiTypography
        as="h3"
        variant="title3"
      >
        {{ props.title }}
      </UiTypography>

      <UiTypography
        v-if="!props.hideSeeMore"
        :class="[$style.link, {
          [$style.seeMoreMobileOnly]: props.seeMoreMobileOnly
        }]"
        :as="NuxtLink"
        :to="props.seeMoreUrl"
        variant="label"
        schema="link"
        @click="emits('onClickSeeMore')"
      >
        {{ props.seeMoreText ?? $t("ui.seeMore") }}
        <ArrowRightBoldIcon />
      </UiTypography>
    </div>

    <slot />
  </section>
</template>

<style module lang="scss">
@import "~/styles/mixins";
@import "~/styles/variables";
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .header {
    display: flex;
    align-items: center;
    gap: 20px;

    &.alignEnd {
      justify-content: space-between;
    }

    .link {
      display: flex;
      align-items: center;
      gap: 8px;

      &.seeMoreMobileOnly {
        display: none;

        @include mobileDevice() {
          display: flex;
        }
      }

      svg {
        width: 20px;
      }
    }
  }
}
</style>
