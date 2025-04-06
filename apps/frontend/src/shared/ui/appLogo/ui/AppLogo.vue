<script lang="ts" setup>
import { useLocalePath } from "#i18n"
import { UiIcon } from "../../UiIcon"
import { UiTypography } from "../../UiTypography"

const localePath = useLocalePath()
</script>

<template>
  <NuxtLink
    :to="localePath('/')"
    :class="$style.wrapper"
  >
    <UiIcon
      name="icon:logo"
      :size="28"
    />
    <UiTypography
      as="span"
      :class="$style.title"
    >
      Movie Tracker
    </UiTypography>
  </NuxtLink>
</template>

<style lang="scss" module>
@import "~/shared/styles/mixins";

.wrapper {
  display: flex;
  align-items: center;
  gap: 12px;
  vertical-align: middle;

  .title {
    color: var(--c-text);
    font-family: var(--ff-neue-haas);
    font-weight: var(--fw-medium);
    font-size: var(--fs-logo);
    line-height: var(--lh-logo);
    height: 20px;
    @include ellipsisText();
  }
}
</style>
