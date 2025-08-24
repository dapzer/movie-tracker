<script setup lang="ts">
import UiTag from "~/shared/ui/UiTag/UiTag.vue"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiTag"
    :layout="{
      type: 'grid',
      width: 150,
    }"
  >
    <Variant title="Gray">
      <UiTag color="gray">
        Tag text
      </UiTag>
    </Variant>
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
