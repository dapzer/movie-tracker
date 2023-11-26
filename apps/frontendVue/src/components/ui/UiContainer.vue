<script lang="ts" setup></script>

<template>
  <div :class="$style.body">
    <slot />
  </div>
</template>

<style lang="scss" module>
.body {
  margin: 0 auto;
  width: 100%;
  max-width: var(--s-container);
  padding: 0 var(--s-indent);
}
</style>
