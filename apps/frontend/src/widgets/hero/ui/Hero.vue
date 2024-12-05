<script lang="ts" setup>
import { UiContainer } from "~/components/newUi/UiContainer";
import { UiTypography } from "~/components/newUi/UiTypography";
import { UiButton } from "~/components/newUi/UiButton"
import { useAuth, useNavigateToSignInPage } from "#imports"

const {navigateToSignInPage} = useNavigateToSignInPage()
const {isAuthorized}  = useAuth()
</script>

<template>
  <section :class="$style.wrapper">
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
  background-image: url("/heroBackground.png");
  background-size: cover;
  background-position: center;

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
      font-family: var(--ff-neue-haas);
      font-weight: var(--fw-regular);
    }

    .title {
      letter-spacing: -0.025em;
      white-space: pre-wrap;
    }

  }
}
</style>
