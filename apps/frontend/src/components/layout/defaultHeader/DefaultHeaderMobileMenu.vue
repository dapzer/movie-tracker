<script setup lang="ts">

import DefaultHeaderNavigationLinks from "~/components/layout/defaultHeader/DefaultHeaderNavigationLinks.vue";
const emit = defineEmits<{
  (e: "toggleMobileMenu"): void
}>();
</script>

<template>
  <div
    :class="$style.wrapper"
    @click="emit('toggleMobileMenu')"
  >
    <div
      :class="$style.content"
      @click.stop
    >
      <DefaultHeaderNavigationLinks
        :class="$style.list"
        @onClickLink="emit('toggleMobileMenu')"
      />
    </div>
  </div>
</template>

<style module lang="scss">
.wrapper {
  width: 100%;
  position: fixed;
  top: var(--s-header-height);
  height: 100%;
  background-color: rgba(0,0,0,0.5);
  left: 0;

  .content {
    width: 100%;
    border-top: 1px solid var(--c-text);
    padding: var(--s-indent);
    background: var(--c-accent);

    .list {
      width: 100%;
      display: flex;
      align-items: center;
      justify-content: space-around;
      flex-wrap: wrap;
    }
  }
}
</style>
