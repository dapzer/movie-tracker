<script setup lang="ts">
import { ref } from "vue"
import UiFilterTrigger from "~/shared/ui/UiFilterTrigger/UiFilterTrigger.vue"

const active = ref(false)
</script>

<template>
  <Story
    title="UiFilterTrigger"
    group="ui-kit"
  >
    <template #default>
      <UiFilterTrigger
        :active="active"
        @click="active = true"
        @clear="active = false"
      >
        Genre
      </UiFilterTrigger>
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
