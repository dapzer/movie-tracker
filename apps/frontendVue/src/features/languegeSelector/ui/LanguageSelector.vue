<script lang="ts" setup>

import { allowedLanguages } from "~/features/languegeSelector/model/languages";
import UiTypography from "~/components/ui/UiTypography.vue";
import { useSwitchLocalePath } from "#i18n";
import { NuxtLink } from "#components";
import { useI18n } from "#imports";

const switchLocalePath = useSwitchLocalePath();
const { locale } = useI18n();
</script>

<template>
  <div :class="$style.wrapper">
    <template
      v-for="(language, index) in allowedLanguages"
      :key="language"
    >
      <UiTypography
        :as="NuxtLink"
        :class="[$style.language, {
          [$style.active]: locale === language
        }]"
        :to="switchLocalePath(language)"
        variant="link"
      >
        {{ language }}
      </UiTypography>
      <div
        v-if="index < allowedLanguages.length - 1"
        :class="$style.divider"
      />
    </template>
  </div>
</template>

<style lang="scss" module>
.wrapper {
  display: flex;
  gap: 8px;
  align-items: center;
}

.divider {
  width: 1px;
  height: 27px;
  background: var(--c-text);
}

.language {
  text-transform: capitalize;
}

.active {
  color: var(--c-highlight);
}
</style>
