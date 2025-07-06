<script lang="ts" setup>
import { UiListCard } from "~/shared/ui/UiCard/listCard"
import { UiMediaCard, UiMediaCardHorizontal, UiMediaCardSkeleton } from "~/shared/ui/UiCard/mediaCard"
import UiCardBase from "~/shared/ui/UiCard/UiCardBase.vue"
import { UiVideoCard } from "~/shared/ui/UiCard/videoCard"
import { UiTypography } from "~/shared/ui/UiTypography"
import { getPlaceholderImageUrl } from "~/shared/utils/getPlaceholderImageUrl"
import UiMediaCardHorizontalSkeleton from "./mediaCard/UiMediaCardHorizontalSkeleton.vue"
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
          :image-src="getPlaceholderImageUrl(179, 277)"
          description="Jan 07 2024, USA"
          title="Movie Title"
          link-url=""
        />
      </Variant>

      <Variant
        title="MediaCardHorizontal"
      >
        <UiMediaCardHorizontal
          :image-src="getPlaceholderImageUrl(179, 277)"
          sub-description="Jan 07 2024, USA"
          title="Movie Title"
          link-url=""
        >
          <template #title>
            <UiTypography variant="cardTitle">
              Card Title
            </UiTypography>
          </template>
          <template #description>
            <UiTypography variant="description">
              Card description
            </UiTypography>
          </template>
        </UiMediaCardHorizontal>
      </Variant>

      <Variant
        title="MediaCardSkeleton"
      >
        <UiMediaCardSkeleton />
      </Variant>

      <Variant
        title="UiMediaCardHorizontalSkeleton"
      >
        <UiMediaCardHorizontalSkeleton />
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
          :user="{
            id: '1',
            image: getPlaceholderImageUrl(32, 32),
            name: 'UserName',
          }"
          user-page-url="/"
          :images-src="Array(6).fill(0).map((_, i) => i).map((_, i) => getPlaceholderImageUrl(179, 277))"
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
          :images-src="Array(6).fill(0).map((_, i) => i).map((_, i) => getPlaceholderImageUrl(179, 277))"
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
          :user="{
            id: '1',
            image: getPlaceholderImageUrl(32, 32),
            name: 'UserName',
          }"
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
