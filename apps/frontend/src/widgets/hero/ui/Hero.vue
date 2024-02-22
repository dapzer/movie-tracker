<script lang="ts" setup>
import UiContainer from "~/components/ui/UiContainer.vue";
import { ServiceSocialList } from "~/features/serviceSocial";
import UiTypography from "~/components/ui/UiTypography.vue";
</script>

<template>
  <section>
    <UiContainer :class="$style.wrapper">
      <UiTypography
        as="h1"
        variant="title2"
      >
        {{ $t("hero.title") }}
      </UiTypography>

      <UiTypography :class="$style.about">
        {{ $t('hero.aboutService') }}
      </UiTypography>

      <ServiceSocialList />
    </UiContainer>
  </section>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  flex-direction: column;
  gap: 10px;

  .about {
      color: var(--c-secondary);
      font-weight: var(--fw-light);
      white-space: pre-line;
  }
}
</style>
