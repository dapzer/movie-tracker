<script setup lang="ts">
import UiSpoilerText from "~/shared/ui/UiSpoilerText/UiSpoilerText.vue"
import { UiTypography } from "~/shared/ui/UiTypography"
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
