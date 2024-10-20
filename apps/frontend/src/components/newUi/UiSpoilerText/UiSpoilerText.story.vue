<script setup lang="ts">

import { UiTypography } from "~/components/newUi/UiTypography"
import UiSpoilerText from "~/components/newUi/UiSpoilerText/UiSpoilerText.vue"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiSpoilerText"
  >
    <template #default>
      <UiSpoilerText>
        <UiTypography>
          This is a spoiler text
        </UiTypography>
      </UiSpoilerText>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
