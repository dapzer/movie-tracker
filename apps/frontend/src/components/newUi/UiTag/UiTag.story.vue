<script setup lang="ts">

import UiTag from "~/components/newUi/UiTag/UiTag.vue"
</script>

<template>
  <Story
    title="UiTag"
    :layout="{
      type: 'grid',
      width: 150,
    }"
  >
    <Variant title="Orange">
      <UiTag color="orange">
        Tag text
      </UiTag>
    </Variant>
    <Variant title="Green">
      <UiTag color="green">
        Tag text
      </UiTag>
    </Variant>
  </Story>
</template>

<style scoped lang="scss">

</style>
