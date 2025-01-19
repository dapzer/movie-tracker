<script setup lang="ts">
import { computed, ref } from "vue"
import { UiTypography, type UiTypographyProps } from "~/components/ui/UiTypography"
import { UiButton } from "~/components/ui/UiButton"
import { UiIcon } from "~/components/ui/UiIcon"

interface UiTrimmedTextProps extends UiTypographyProps {
  text: string;
  maxLines: number;
  maxCharsInLine: number;
}

const props = defineProps<UiTrimmedTextProps>();
const showMore = ref(false);

const trimText = computed(() => {
  return props.text.length > (props.maxCharsInLine * props.maxLines)
})

defineOptions({
  inheritAttrs: false
})
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      v-bind="$attrs"
      :class="[$style.text, {
        [$style.trimmed]: !showMore && trimText
      }]"
      :variant="props.variant"
      :as="props.as"
      :schema="props.schema"
      :style="{
        '--max-lines': props.maxLines
      }"
    >
      {{ text }}
    </UiTypography>

    <UiButton
      v-if="trimText"
      :class="[$style.button, {
        [$style.active]: showMore
      }]"
      variant="text"
      scheme="link"
      @click="showMore = !showMore"
    >
      {{ showMore ? $t("ui.showLess") : $t("ui.showMore") }}
      <UiIcon
        :class="$style.icon"
        :size="20"
        name="icon:arrow-right-bold"
      />
    </UiButton>
  </div>
</template>

<style module lang="scss">
@import "~/styles/mixins";

.wrapper {
  display: flex;
  flex-direction: column;
  gap: 12px;

  .text {
    position: relative;


    &.trimmed {
      @include multiLineEllipsis(var(--max-lines));
      text-overflow: unset;

      &::after {
        content:  "\00a0";
        position: absolute;
        bottom: 0;
        right: 0;
        left: 0;
        background: linear-gradient(90deg, rgba(14, 14, 14, 0) 0%, #0E0E0E 100%);
      }
    }
  }

  .button {
    display: flex;
    gap: 8px;
    align-items: center;

    .icon {
      transform: rotate(90deg);
      width: 20px;
    }

    &.active {
      .icon {
        transform: rotate(-90deg);
      }
    }
  }
}
</style>
