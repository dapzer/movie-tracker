<script setup lang="ts">
import type { ComponentOrTag } from "~/shared/types/ComponentOrTag"
import { NuxtLink } from "#components"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"

interface UiSectionWithSeeMoreProps {
  title: string
  seeMoreText?: string
  hideSeeMore?: boolean
  seeMoreUrl?: string
  seeMoreMobileOnly?: boolean
  seeMoreAlign?: "start" | "end"
  titleAs?: ComponentOrTag
}

const props = withDefaults(defineProps<UiSectionWithSeeMoreProps>(), {
  seeMoreAlign: "start",
  titleAs: "h2",
})
const emits = defineEmits<{
  (e: "onClickSeeMore"): void
}>()
</script>

<template>
  <section :class="$style.wrapper">
    <div
      :class="[$style.header, {
        [$style.alignEnd]: props.seeMoreAlign === 'end',
      }]"
    >
      <UiTypography
        :as="props.titleAs"
        variant="title3"
      >
        {{ props.title }}
      </UiTypography>

      <UiTypography
        v-if="!props.hideSeeMore"
        :class="[$style.link, {
          [$style.seeMoreMobileOnly]: props.seeMoreMobileOnly,
        }]"
        :as="NuxtLink"
        :to="props.seeMoreUrl"
        variant="label"
        schema="link"
        @click="emits('onClickSeeMore')"
      >
        {{ props.seeMoreText ?? $t("ui.seeMore") }}
        <UiIcon
          name="icon:arrow-right-bold"
          :size="20"
        />
      </UiTypography>
    </div>

    <slot />
  </section>
</template>

<style module lang="scss">
@import "~/shared/styles/mixins";
@import "~/shared/styles/breakpoints";
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
    }
  }
}
</style>
