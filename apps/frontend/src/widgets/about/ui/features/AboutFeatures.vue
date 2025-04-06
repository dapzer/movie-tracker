<script setup lang="ts">
import { h } from "vue"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"
import FeatureCard from "~/widgets/about/ui/features/FeatureCard.vue"

const features = [{
  title: "about.features.discover.title",
  description: "about.features.discover.description",
  icon: h(UiIcon, { name: "icon:discover-feature" }),
}, {
  title: "about.features.lists.title",
  description: "about.features.lists.description",
  icon: h(UiIcon, { name: "icon:lists-feature" }),
}, {
  title: "about.features.tracking.title",
  description: "about.features.tracking.description",
  icon: h(UiIcon, { name: "icon:tracking-feature" }),
}, {
  title: "about.features.status.title",
  description: "about.features.status.description",
  icon: h(UiIcon, { name: "icon:status-feature" }),
}, {
  title: "about.features.review.title",
  description: "about.features.review.description",
  icon: h(UiIcon, { name: "icon:review-feature" }),
}, {
  title: "about.features.community.title",
  description: "about.features.community.description",
  icon: h(UiIcon, { name: "icon:community-feature" }),
}]
</script>

<template>
  <UiContainer
    :class="$style.wrapper"
    as="section"
  >
    <div :class="$style.header">
      <UiTypography
        as="h1"
        variant="title2"
      >
        {{ $t("about.features.title") }}
      </UiTypography>
      <UiTypography
        :class="$style.description"
        variant="subheading"
      >
        {{ $t("about.features.description") }}
      </UiTypography>
    </div>

    <div :class="$style.list">
      <FeatureCard
        v-for="(feature, index) in features"
        :key="index"
        :title="$t(feature.title)"
        :description="$t(feature.description)"
        :icon="feature.icon"
      />
    </div>
  </UiContainer>
</template>

<style module lang="scss">
@import "~/shared/styles/variables";

.wrapper {
  margin-top: 96px;
  display: flex;
  flex-direction: column;
  gap: 36px;

  @include tabletDevice {
    gap: 30px;
    margin-top: 80px;
  }

  @include mobilePlusDevice {
    gap: 24px;
    margin-top: 70px;
  }

  .header {
    display: flex;
    flex-direction: column;
    gap: 12px;
    text-align: center;
    white-space: pre-wrap;

    .description {
      color: var(--c-white-75);
    }

    @include mobilePlusDevice {
      text-align: left;
    }
  }

  .list {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 24px;

    @include tabletDevice {
      gap: 20px;
    }

    @include mobilePlusDevice {
      grid-template-columns: 1fr;
      gap: 16px;
    }
  }
}
</style>
