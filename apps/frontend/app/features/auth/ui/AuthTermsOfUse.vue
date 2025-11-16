<script setup lang="ts">
import { NuxtLink } from "#components"
import { useLocalePath } from "#i18n"
import { useI18n } from "#imports"
import { LanguagesEnum } from "~/shared/types/languagesEnum"
import { UiTypography } from "~/shared/ui/UiTypography"

const { locale } = useI18n()
const localePath = useLocalePath()
</script>

<template>
  <UiTypography
    :class="$style.body"
    variant="description"
  >
    {{ $t("auth.signInAgreeTerms") }}
    <br v-if="locale === LanguagesEnum.EN">
    <UiTypography
      schema="link"
      :as="NuxtLink"
      :to="localePath('/legal/terms-of-use')"
    >
      {{ $t("ui.termsOfUse") }}
    </UiTypography>
    {{ $t("ui.and") }}
    <UiTypography
      schema="link"
      :as="NuxtLink"
      :to="localePath('/legal/privacy-policy')"
    >
      {{ $t("auth.privacyPolicy") }}
    </UiTypography>
    <template v-if="locale === LanguagesEnum.RU">
      Movie Tracker
    </template>
  </UiTypography>
</template>

<style module lang="scss">
.body {
  text-align: center;

  a {
    font-size: inherit;
    font-weight: inherit;
  }
}
</style>
