<script lang="ts" setup>
import UiTypography from "~/components/ui/UiTypography.vue";
import { ref } from "vue";

interface UiInfoHeaderProps {
  title: string;
  description?: string;
  image?: string;
}

const props = defineProps<UiInfoHeaderProps>();
const imageSrc = ref(props.image);

const handleImageLoadingError = () => {
  imageSrc.value = "/defaultPoster.svg";
};
</script>

<template>
  <section :class="$style.wrapper">
    <div :class="[$style.titleBlock, $style.mobileOnly]">
      <UiTypography
        as="h1"
        variant="title2"
      >
        {{ props.title }}
      </UiTypography>
      <UiTypography
        v-if="props.description"
        as="h2"
        variant="title3"
      >
        {{ props.description }}
      </UiTypography>
    </div>

    <div :class="$style.poster">
      <div>
        <NuxtImg
          :height="405"
          :src="imageSrc"
          :width="270"
          @error="handleImageLoadingError"
        />
      </div>

      <slot name="posterFooter" />
    </div>

    <div :class="$style.content">
      <div :class="$style.titleBlock">
        <UiTypography
          as="h1"
          variant="title2"
        >
          {{ props.title }}
        </UiTypography>
        <UiTypography
          as="h2"
          variant="title3"
        >
          {{ props.description }}
        </UiTypography>
      </div>

      <ul :class="$style.list">
        <slot />
      </ul>
    </div>
  </section>
</template>

<style lang="scss" module>
@import "~/styles/variables";

.wrapper {
  display: flex;
  gap: 50px;

  .titleBlock {
    h2 {
      color: var(--c-text);
    }
  }

  .poster {
    width: 100%;
    max-width: 300px;
    display: flex;
    flex-direction: column;
    gap: 20px;

    img {
      object-fit: contain;
      border-radius: var(--s-border-radius);
    }
  }

  .content {
    width: 100%;
  }

  .list {
    padding-top: 20px;
    display: flex;
    flex-direction: column;
    gap: 10px;

    li {
      list-style: none;
    }
  }

  .mobileOnly {
    display: none;
  }

  @media screen and (max-width: $bp-md) {
    flex-direction: column;
    gap: 20px;

    .poster {
      max-width: 475px;
    }

    .titleBlock {
      display: none;
    }

    .mobileOnly {
      display: block;
    }

    .list {
      padding-top: unset;
    }
  }
}
</style>
