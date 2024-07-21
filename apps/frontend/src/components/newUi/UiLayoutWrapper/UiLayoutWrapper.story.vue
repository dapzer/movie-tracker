<script setup lang="ts">

import UiLayoutWrapper from "~/components/newUi/UiLayoutWrapper/UiLayoutWrapper.vue"
</script>

<template>
  <Story title="UiLayoutWrapper">
    <template #default>
      <UiLayoutWrapper>
        <header :class="$style.header">
          Header
        </header>
        <main :class="$style.main">
          Content
        </main>
        <footer :class="$style.footer">
          Footer
        </footer>
      </UiLayoutWrapper>
    </template>
  </Story>
</template>

<style module lang="scss">
.header {
  height: 50px;
  background-color: orange;
}

.main {
  background-color: green;
}

.footer {
  height: 75px;
  background-color: blue;
}
</style>
