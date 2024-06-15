<script lang="ts" setup>

import UiCardBase from '~/components/newUi/UiCard/UiCardBase.vue';
import { UiTypography } from '~/components/newUi/UiTypography';
import { UiMediaCard } from '~/components/newUi/UiCard/mediaCard';
import { UiVideoCard } from '~/components/newUi/UiCard/videoCard';
</script>

<template>
  <Story title="UiCard">
    <template #default>
      <Variant
        title="Base"
      >
        <UiCardBase>
          <template #image>
            <img
              :class="$style.image"
              alt="placeholder"
              src="https://via.placeholder.com/179x277"
            >
          </template>
          <template #content>
            <UiTypography variant="cardTitle">
              Card Title
            </UiTypography>
          </template>
        </UiCardBase>
      </Variant>

      <Variant
        title="MediaCard"
      >
        <UiMediaCard
          imageSrc="https://via.placeholder.com/179x277"
          description="Jan 07 2024, USA"
          title="Movie Title"
        />
      </Variant>

      <Variant
        title="VideoCard"
      >
        <UiVideoCard
          preview-src="https://via.placeholder.com/279x157"
          description="Jan 07 2024"
          title="Video Title"
        />
      </Variant>
    </template>
  </Story>
</template>

<style lang="scss" module>
.image {
  aspect-ratio: 2 / 3;
  object-fit: cover;
}
</style>
