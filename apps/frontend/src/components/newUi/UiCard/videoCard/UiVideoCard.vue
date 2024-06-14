<script lang="ts" setup>

import UiCardBase from '~/components/newUi/UiCard/UiCardBase.vue';
import { UiImage } from '~/components/newUi/UiImage';
import { PlayIcon } from '~/components/ui/icons';
import { UiTypography } from '~/components/newUi/UiTypography';

interface UiVideoCardProps {
  previewSrc: string;
  description: string;
  title: string;
}

const props = defineProps<UiVideoCardProps>();
</script>

<template>
  <UiCardBase
    :class="$style.wrapper"
    :width="295"
  >
    <template #image>
      <div :class="$style.previewWrapper">
        <UiImage
          :src="props.previewSrc"
          height="157"
          width="279"
        />

        <div :class="$style.previewOverlay">
          <PlayIcon />
        </div>
      </div>
    </template>

    <template #content>
      <div :class="$style.content">
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
        >
          {{ props.title }}
        </UiTypography>
        <UiTypography
          variant="description"
        >
          {{ props.description }}
        </UiTypography>
      </div>
    </template>
  </UiCardBase>
</template>

<style lang="scss" module>
@import '~/styles/mixins';
@import '~/styles/variables';

.wrapper {
  cursor: pointer;

  .content {
    display: flex;
    flex-direction: column;
    gap: 4px;

    .title {
      @include ellipsisText();
      @include multiLineEllipsis(2);
      height: calc(var(--lh-card-title) * 2);
    }
  }

  .previewWrapper {
    position: relative;
    display: flex;
    justify-content: center;
    align-items: center;
    width: 100%;
    height: 157px;

    @media screen and (max-width: $bp-sm) {
      height: 92px;
    }

    img {
      width: 100%;
      height: 100%;
    }

    img,
    .previewOverlay {
      border-radius: var(--s-border-radius-small);
    }

    .previewOverlay {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      opacity: .8;
      background-color: var(--c-main-background);
      color: var(--c-text);
      display: flex;
      justify-content: center;
      align-items: center;
    }
  }

  &:not(:hover) .previewOverlay {
    display: none;
  }
}
</style>
