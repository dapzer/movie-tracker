<script setup lang="ts">
import UiDivider from "~/shared/ui/UiDivider/UiDivider.vue"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiDivider"
  >
    <template #default>
      <div :class="$style.wrapper">
        <UiDivider />
      </div>
    </template>
  </Story>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  height: 100%;
}
</style>
