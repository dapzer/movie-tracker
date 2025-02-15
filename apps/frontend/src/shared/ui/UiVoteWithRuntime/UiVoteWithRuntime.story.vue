<script setup lang="ts">

import UiVoteWithRuntime from "~/shared/ui/UiVoteWithRuntime/UiVoteWithRuntime.vue"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiVoteWithRuntime"
  >
    <template #default>
      <UiVoteWithRuntime
        :voteAverage="7.5"
        :voteCount="10200"
        :runtime="144"
      />
    </template>
  </Story>
</template>

<style scoped lang="scss">

</style>
