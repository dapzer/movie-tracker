<script setup lang="ts">
import { UiTypography } from "~/shared/ui/UiTypography"
</script>

<template>
  <div>
    <UiTypography
      as="h1"
      variant="title2"
    >
      {{ $t("releaseSubscription.pageTitle") }}
    </UiTypography>
  </div>
</template>
