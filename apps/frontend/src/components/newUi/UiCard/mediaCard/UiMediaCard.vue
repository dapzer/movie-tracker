<script setup lang="ts">

import UiCardBase from '~/components/newUi/UiCard/UiCardBase.vue';
import { UiTypography } from '~/components/newUi/UiTypography';
import { ref } from 'vue';

interface UiMediaCardProps {
  image?: string
  title?: string
  description?: string
  width?: number
  link?: string
}

const props = withDefaults(defineProps<UiMediaCardProps>(), {
  width: 195,
})
const imageSrc = ref(props.image ?? '/defaultPoster.svg')

const handleImageLoadingError = () => {
  imageSrc.value = '/defaultPoster.svg'
}
</script>

<template>
  <UiCardBase
    :width="props.width"
    :link="props.link"
  >
    <template #image>
      <NuxtImg
        :class="$style.image"
        :src="imageSrc"
        width="179"
        height="277"
        loading="lazy"
        decoding="async"
        @error="handleImageLoadingError"
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
    white-space: unset;
    line-clamp: 2;
    display: -webkit-box;
    -webkit-line-clamp: 2;
    -webkit-box-orient: vertical;
    height: calc(var(--lh-card-title) * 2);
    word-break: break-word;
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
