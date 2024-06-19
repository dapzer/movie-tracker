<script lang="ts" setup>

import UiCardBase from '~/components/newUi/UiCard/UiCardBase.vue';
import { UiTypography } from '~/components/newUi/UiTypography';
import { UiImage } from '~/components/newUi/UiImage';
import { NuxtLink } from "#components"

interface UiMediaCardProps {
  imageSrc?: string;
  title?: string;
  description?: string;
  width?: number;
  linkUrl: string;
}

const props = withDefaults(defineProps<UiMediaCardProps>(), {
  width: 195,
});
</script>

<template>
  <UiCardBase
    :linkUrl:="props.linkUrl"
    :width="props.width"
  >
    <template #image>
      <UiImage
        :class="$style.image"
        :src="props.imageSrc"
        height="277"
        width="179"
      />
    </template>

    <template #content>
      <div :class="$style.content">
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
          :as="NuxtLink"
          :to="props.linkUrl"
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


<style lang="scss" module>
@import '~/styles/mixins';
@import '~/styles/variables';

.image {
  aspect-ratio: 2/3;
  object-fit: cover;
}

.content {
  display: flex;
  flex-direction: column;
  gap: 4px;

  .title {
    @include ellipsisText();
    @include multiLineEllipsis(2);
  }

  .footer {
    display: flex;
    justify-content: space-between;
    gap: 4px;

    .description {
      @include ellipsisText();
    }
  }
}
</style>
