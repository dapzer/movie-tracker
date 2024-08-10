<script generic="T" setup lang="ts">
import { type TagColor, UiTag } from "~/components/newUi/UiTag"
import { UiTypography } from "~/components/newUi/UiTypography"
import { UiSlider } from "~/components/newUi/UiSlider"

interface FeedItemProps<T> {
  data: T[] | undefined;
  title: string;
  tagText?: string;
  tagColor?: TagColor;
  slideWidth?: number;
  sliderWithShadow?: boolean;
}

const props = defineProps<FeedItemProps<T>>()

</script>

<template>
  <section
    v-if="data"
    :class="$style.wrapper"
  >
    <div :class="$style.header">
      <UiTypography
        variant="title3"
        as="h2"
      >
        {{ props.title }}
      </UiTypography>

      <UiTag
        v-if="props.tagText"
        :color="props.tagColor"
      >
        {{ props.tagText }}
      </UiTag>
    </div>

    <UiSlider
      :data="props.data as T[]"
      :maxWidth="props.slideWidth"
      :withShadow="props.sliderWithShadow"
    >
      <template #slide="{ item }">
        <slot
          name="slide"
          :item="item"
        />
      </template>
    </UiSlider>
  </section>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 20px;

  .header {
    display: flex;
    align-items: center;
    gap: 8px;
  }
}
</style>
