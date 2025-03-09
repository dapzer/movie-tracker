<script setup lang="ts">
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { UiTypography } from "../~/shared/ui/UiTypography"

interface DefaultFooterLinkListProps {
  links: {
    title: string
    href: string
  }[]
}

const props = defineProps<DefaultFooterLinkListProps>()

const localePath = useLocalePath()
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography
      v-for="link in props.links"
      :key="link.title"
      variant="label"
      :as="NuxtLink"
      :to="localePath(link.href)"
    >
      {{ $t(link.title) }}
    </uitypography>
  </div>
</template>

<style module lang="scss">
@import "~/styles/variables";
@import "~/styles/mixins";

.wrapper {
  display: grid;
  gap: 8px 24px;
  grid-template-columns: 1fr 1fr;

  a {
    //font-size: var(--fs-label-small);
    color: var(--c-white-60);
    line-height: var(--lh-input);
    font-weight: var(--fw-regular);
  }

  @include mobileDevice() {
    grid-template-columns: 1fr;
  }
}
</style>
