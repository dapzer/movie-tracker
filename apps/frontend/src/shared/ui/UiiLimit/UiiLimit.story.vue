<script setup lang="ts">
import UiiLimit from "~/shared/ui/UiiLimit/UiiLimit.vue"
</script>

<template>
  <Story
    title="UiiLimit"
    group="ui-kit"
  >
    <template #default>
      <UiiLimit
        :limit="10"
        :current="5"
        :is-loading="false"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
