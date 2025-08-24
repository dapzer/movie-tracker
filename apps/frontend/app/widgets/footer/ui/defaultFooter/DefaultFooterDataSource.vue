<script setup lang="ts">
import { NuxtLink } from "#components"
import { UiIcon } from "~/shared/ui/UiIcon"
import { UiTypography } from "~/shared/ui/UiTypography"
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
    <UiIcon
      name="icon:tmdb-logo"
      :width="84"
    />
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
