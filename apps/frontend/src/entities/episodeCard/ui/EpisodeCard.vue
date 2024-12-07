<script lang="ts" setup>

import { UiCardBase } from '~/components/ui/UiCard';
import { UiImage } from '~/components/ui/UiImage';
import { UiTypography } from '~/components/ui/UiTypography';
import { computed } from 'vue';

interface EpisodeCardProps {
  width?: number;
  season: number;
  episode: number;
  imageSrc: string;
  title: string;
  description: string;
}

const props = withDefaults(defineProps<EpisodeCardProps>(), {
  width: 266,
});

const episodeTitle = computed(() => `S${props.season}.E${props.episode} ∙ ${props.title}`);
</script>

<template>
  <UiCardBase
    :class="$style.wrapper"
    :width="props.width"
  >
    <template #image>
      <UiImage
        :class="$style.image"
        :src="props.imageSrc"
        height="157"
        width="250"
      />
    </template>

    <template #content>
      <div :class="$style.content">
        <UiTypography
          :class="$style.title"
          variant="cardTitle"
        >
          {{ episodeTitle }}
        </UiTypography>
        <UiTypography
          :class="$style.description"
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

  .image {
    object-fit: cover;
    aspect-ratio: 16 / 9;
  }

  .content {
    display: flex;
    gap: 4px;
    flex-direction: column;

    .title {
      @include ellipsisText;
    }

    .description {
      @include ellipsisText;
    }
  }
}
</style>
