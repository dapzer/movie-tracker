<script lang="ts" setup>
import { useAuth } from "~/shared/composables/useAuth"
import { useNavigateToSignInPage } from "~/shared/composables/useNavigateToSignInPage"
import { UiButton } from "~/shared/ui/UiButton"
import { UiContainer } from "~/shared/ui/UiContainer"
import { UiImage } from "~/shared/ui/UiImage"
import { UiTypography } from "~/shared/ui/UiTypography"

const { navigateToSignInPage } = useNavigateToSignInPage()
const { isAuthorized } = useAuth()
</script>

<template>
  <section :class="$style.wrapper">
    <UiImage
      :class="$style.background"
      src="/heroBackground.webp"
      loading="eager"
      preload
    />
    <UiContainer :class="$style.body">
      <UiTypography
        as="h1"
        variant="title"
        :class="$style.title"
      >
        {{ $t("hero.title") }}
      </UiTypography>

      <UiTypography :class="$style.description">
        {{ $t('hero.aboutService') }}
      </UiTypography>

      <UiButton
        v-if="!isAuthorized"
        :class="$style.button"
        @click="navigateToSignInPage"
      >
        {{ $t('hero.button') }}
      </UiButton>
    </UiContainer>
  </section>
</template>

<style lang="scss" module>
.wrapper {
  padding: 24px 0;
  min-height: 480px;
  width: 100%;
  display: flex;
  justify-content: center;
  align-items: center;
  position: relative;
  //background-image: url("/heroBackground.webp");
  //background-size: cover;
  //background-position: center;

  .background {
    position: absolute;
    top: 0;
    left: 0;
    width: 100%;
    height: 100%;
    object-fit: cover;
    z-index: -1;
  }

  .body {
    display: flex;
    max-width: calc(555px + (var(--s-indent) * 2));
    flex-direction: column;
    gap: 16px;
    text-align: center;

    .button {
      margin-top: 8px;
      margin-right: auto;
      margin-left: auto;
    }

    .description {
      font-family: var(--ff-libra-franklin);
      font-weight: var(--fw-regular);
    }

    .title {
      letter-spacing: -0.025em;
      white-space: pre-wrap;
    }
  }
}
</style>
