<script setup lang="ts">

import UiScore from "~/components/newUi/UiRating/UiRating.vue"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiRating"
    :layout="{
      type: 'grid',
      width: 150,
    }"
  >
    <Variant title="Orange">
      <UiScore :value="2" />
    </Variant>
    <Variant title="Orange">
      <UiScore :value="5" />
    </Variant>
    <Variant title="Green">
      <UiScore :value="8.7" />
    </Variant>
  </Story>
</template>

<style scoped lang="scss">

</style>
