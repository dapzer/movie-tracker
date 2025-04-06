<script setup lang="ts">
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"

interface PersonWithRoleProps {
  name: string
  description: string
  imageSrc?: string
  personPageUrl: string
}

const props = defineProps<PersonWithRoleProps>()
</script>

<template>
  <NuxtLink
    :class="$style.wrapper"
    :to="props.personPageUrl"
  >
    <UiImage
      :class="$style.image"
      :src="props.imageSrc"
      fallback-src="/avatar.svg"
    />
    <div :class="$style.info">
      <UiTypography variant="cardTitle">
        {{ props.name }}
      </UiTypography>
      <UiTypography variant="description">
        {{ props.description }}
      </UiTypography>
    </div>
  </NuxtLink>
</template>

<style module lang="scss">
@import "~/shared/styles/variables";
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  gap: 16px;
  align-items: center;
  width: 100%;
  min-width: 0;

  .image {
    border-radius: 50%;
    aspect-ratio: 1 / 1;
    width: 100%;
    max-width: 70px;
    object-fit: cover;

    @include mobileDevice() {
      max-width: 80px;
    }
  }

  .info {
    display: flex;
    flex-direction: column;
    gap: 4px;
    min-width: 0;

    p {
      @include ellipsisText();
    }
  }
}
</style>
