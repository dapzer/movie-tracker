<script setup lang="ts">

import UiContainer from "~/components/newUi/UiContainer/UiContainer.vue"
</script>

<template>
  <Story
    group="ui-kit"
    title="UiContainer"
  >
    <template #default>
      <UiContainer>
        <div :class="$style.content" />
      </UiContainer>
    </template>
  </Story>
</template>

<style module lang="scss">
.content {
  width: 100%;
  height: 50px;
  background: var(--c-card-background-hovered);
}
</style>
