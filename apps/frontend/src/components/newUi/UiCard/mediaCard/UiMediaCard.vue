<script setup lang="ts">

import UiCardBase from '~/components/newUi/UiCard/UiCardBase.vue';
import { UiTypography } from '~/components/newUi/UiTypography';
import { UiImage } from '~/components/newUi/UiImage';

interface UiMediaCardProps {
  imageSrc?: string
  title?: string
  description?: string
  width?: number
  link?: string
}

const props = withDefaults(defineProps<UiMediaCardProps>(), {
  width: 195,
})
</script>

<template>
  <UiCardBase
    :width="props.width"
    :link="props.link"
  >
    <template #image>
      <UiImage
        :class="$style.image"
        :src="props.imageSrc"
        width="179"
        height="277"
      />
    </template>

    <template #content>
      <div :class="$style.content">
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
        >
          {{ props.title }}
        </UiTypography>

        <div :class="$style.footer">
          <UiTypography
            :class="$style.description"
            variant="description"
          >
            {{ props.description }}
          </UiTypography>

          <slot name="control" />
        </div>
      </div>
    </template>
  </UiCardBase>
</template>


<style module lang="scss">
@import '~/styles/mixins';
@import '~/styles/variables';

.image {
  border-radius: var(--s-border-radius-small);
  height: 277px;

  @media screen and (max-width: $bp-md) {
    height: 219px;
  }

  @media screen and (max-width: $bp-sm) {
    height: 220px;
  }
}

.content {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title {
    @include ellipsisText();
    @include multiLineEllipsis(2);
    height: calc(var(--lh-card-title) * 2);
  }

  .footer {
    display: flex;
    justify-content: space-between;
    gap: 5px;

    .description {
      @include ellipsisText();
    }
  }
}
</style>
