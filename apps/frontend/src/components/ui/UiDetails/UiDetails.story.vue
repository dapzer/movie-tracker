<script setup lang="ts">

import UiDetails from "~/components/ui/UiDetails/UiDetails.vue"
import { UiTypography } from "~/components/ui/UiTypography"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiDetails"
  >
    <template #default>
      <UiDetails title="Click to open">
        <UiTypography>Content</UiTypography>
      </UiDetails>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
