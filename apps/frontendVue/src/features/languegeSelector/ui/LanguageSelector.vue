<script setup lang="ts">

import { allowedLanguages } from "~/features/languegeSelector/model/languages";
import UiTypography from "~/components/ui/UiTypography.vue";
import { useSwitchLocalePath } from "#i18n";
import { NuxtLink } from "#components";

const switchLocalePath = useSwitchLocalePath()
</script>

<template>
  <div :class="$style.wrapper">
    <template
      v-for="(language, index) in allowedLanguages"
      :key="language"
    >
      <UiTypography
        :class="$style.language"
        variant="link"
        :as="NuxtLink"
        :to="switchLocalePath(language)"
        :activeClass="$style.active"
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

<style module lang="scss">
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
