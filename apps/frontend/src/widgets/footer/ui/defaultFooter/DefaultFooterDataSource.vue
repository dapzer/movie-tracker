<script setup lang="ts">

import { NuxtLink } from "#components"
import { UiTypography } from "~/components/ui/UiTypography"
import { TmdbLogoIcon } from "~/components/ui/icons"
</script>

<template>
  <div :class="$style.wrapper">
    <UiTypography variant="description">
      {{ $t('footer.dataSource') }}
      <UiTypography
        variant="description"
        :as="NuxtLink"
        to="https://www.themoviedb.org/"
        target="_blank"
      >
        themoviedb.org
      </UiTypography>
    </UiTypography>
    <TmdbLogoIcon />
  </div>
</template>

<style module lang="scss">
.wrapper {
  display: flex;
  gap: 8px 12px;
  align-items: center;
  flex-wrap: wrap;

  a {
    border-bottom: 1px solid;
  }
}
</style>
