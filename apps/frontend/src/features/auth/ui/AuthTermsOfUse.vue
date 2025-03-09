<script setup lang="ts">
import { NuxtLink } from "#components"
import { useI18n } from "#imports"
import { UiTypography } from "~/shared/ui/UiTypography"
import { LanguagesEnum } from "~/types/languagesEnum"

const { locale } = useI18n()
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
    >
      {{ $t("ui.termsOfUse") }}
    </UiTypography>
    {{ $t("ui.and") }}
    <UiTypography
      schema="link"
      :as="NuxtLink"
    >
      {{ $t("ui.privacyPolicy") }}
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
