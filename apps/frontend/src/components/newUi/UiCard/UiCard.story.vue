<script lang="ts" setup>

import UiCardBase from '~/components/newUi/UiCard/UiCardBase.vue';
import { UiTypography } from '~/components/newUi/UiTypography';
import { UiMediaCard } from '~/components/newUi/UiCard/mediaCard';
import { UiVideoCard } from '~/components/newUi/UiCard/videoCard';
import { UiListCard } from '~/components/newUi/UiCard/listCard';
import { getPlaceholderImageUrl } from '~/utils/getPlaceholderImageUrl';
</script>

<template>
  <Story
    group="ui-kit"
    title="UiCard"
  >
    <template #default>
      <Variant
        title="Base"
      >
        <UiCardBase>
          <template #image>
            <img
              :class="$style.image"
              alt="placeholder"
              :src="getPlaceholderImageUrl(179, 277)"
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
        title="BaseHorizontal"
      >
        <UiCardBase
          horizontal
          :image-width="89"
          :height="149"
        >
          <template #image>
            <img
              :class="$style.image"
              alt="placeholder"
              :src="getPlaceholderImageUrl(89, 133)"
            >
          </template>
          <template #content>
            <UiTypography variant="cardTitle">
              Card Title
            </UiTypography>
            <UiTypography variant="text">
              Lorem ipsum dolor sit amet, consectetur adipisicing elit. Amet
            </UiTypography>
          </template>
        </UiCardBase>
      </Variant>

      <Variant
        title="MediaCard"
      >
        <UiMediaCard
          :imageSrc="getPlaceholderImageUrl(179, 277)"
          description="Jan 07 2024, USA"
          title="Movie Title"
          link-url=""
        />
      </Variant>

      <Variant
        title="VideoCard"
      >
        <UiVideoCard
          :preview-src="getPlaceholderImageUrl(279, 157)"
          description="Jan 07 2024"
          title="Video Title"
        />
      </Variant>

      <Variant
        title="ListCard"
      >
        <UiListCard
          :user-avatar-src="getPlaceholderImageUrl(32, 32)"
          :images-src="Array(6).fill(0).map((_, i) => i).map((_, i) =>getPlaceholderImageUrl(179, 277))"
          user-name="UserName"
          user-url="/"
        >
          <UiTypography variant="listTitle">
            Title
          </UiTypography>
        </UiListCard>
      </Variant>

      <Variant
        title="ListCardWithoutUser"
      >
        <UiListCard
          :images-src="Array(6).fill(0).map((_, i) => i).map((_, i) =>getPlaceholderImageUrl(179, 277))"
          :user-avatar-src="getPlaceholderImageUrl(32, 32)"
        >
          <UiTypography variant="listTitle">
            Title
          </UiTypography>
        </UiListCard>
      </Variant>

      <Variant
        title="ListCardWithoutImages"
      >
        <UiListCard
          :user-avatar-src="getPlaceholderImageUrl(32, 32)"
          user-name="UserName"
          user-url="/"
        >
          <UiTypography variant="listTitle">
            Title
          </UiTypography>
        </UiListCard>
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
