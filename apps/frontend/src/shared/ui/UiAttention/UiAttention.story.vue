<script setup lang="ts">

import { UiButton } from "~/shared/ui/UiButton"
import UiAttention from "~/shared/ui/UiAttention/UiAttention.vue"
</script>

<template>
  <Story
    title="UiAttention"
    group="ui-kit"
  >
    <template #default>
      <UiAttention
        title="Attention"
        description="This is an attention component"
      >
        <UiButton
          @click="console.log('Button clicked')"
        >
          Click me
        </UiButton>
      </UiAttention>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
